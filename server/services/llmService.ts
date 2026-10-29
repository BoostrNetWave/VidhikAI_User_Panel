// LLM Service - Dynamic Multi-Provider Abstraction Layer
// Supports OpenAI, OpenRouter, Anthropic, Gemini, Groq, DeepSeek, Custom Endpoints & Real Usage Logging

import axios, { AxiosError } from 'axios';
import OpenAI from 'openai';
import SystemConfig from '../models/SystemConfig';
import LLMLog from '../models/LLMLog';

export interface LLMRequest {
    model?: string;
    systemPrompt?: string;
    userPrompt: string;
    history?: { role: 'user' | 'assistant' | 'system'; content: string }[];
    temperature?: number;
    maxTokens?: number;
    feature?: string; // 'default' | 'chatbot' | 'doc_gen' | 'doc_review' or custom key
    userId?: string;
    images?: { mimeType: string; base64: string }[];
}

export interface LLMResponse {
    content: string;
    model: string;
    tokensUsed: number;
    promptTokens: number;
    completionTokens: number;
    provider: string;
    latencyMs: number;
}

export interface LLMTestConfig {
    provider: string;
    model: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    prompt?: string;
}

class LLMService {
    private calculateCost(provider: string, model: string, totalTokens: number): number {
        const m = (model || '').toLowerCase();
        let ratePer1k = 0.001; // default $0.001 per 1k tokens

        if (m.includes('gpt-4o-mini')) ratePer1k = 0.0003;
        else if (m.includes('gpt-4o') || m.includes('gpt-4')) ratePer1k = 0.005;
        else if (m.includes('claude-3-5-sonnet') || m.includes('claude-3-5')) ratePer1k = 0.003;
        else if (m.includes('gemini-1.5-flash') || m.includes('gemini-2')) ratePer1k = 0.00015;
        else if (m.includes('deepseek')) ratePer1k = 0.00028;
        else if (m.includes('llama') || m.includes('mixtral')) ratePer1k = 0.0002;
        else if (provider === 'custom') ratePer1k = 0; // Local custom is free

        return (totalTokens / 1000) * ratePer1k;
    }

    /**
     * Resolves configuration for a given feature key from SystemConfig or Environment Fallback
     */
    public async getFeatureConfig(featureKey?: string) {
        let keyToLook = 'LLM_CONFIG_DEFAULT';
        if (featureKey === 'chatbot') keyToLook = 'LLM_CONFIG_CHATBOT';
        else if (featureKey === 'doc_gen') keyToLook = 'LLM_CONFIG_DOC_GEN';
        else if (featureKey === 'doc_review') keyToLook = 'LLM_CONFIG_DOC_REVIEW';
        else if (featureKey && featureKey.startsWith('LLM_CONFIG_')) keyToLook = featureKey;
        else if (featureKey && featureKey !== 'default') keyToLook = `LLM_CONFIG_${featureKey.toUpperCase()}`;

        let configDoc = await SystemConfig.findOne({ key: keyToLook });
        if (!configDoc && keyToLook !== 'LLM_CONFIG_DEFAULT') {
            configDoc = await SystemConfig.findOne({ key: 'LLM_CONFIG_DEFAULT' });
        }

        const val = configDoc?.value || {};
        const provider = (val.provider || 'openai').toLowerCase();
        const model = val.model || (provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : provider === 'gemini' ? 'gemini-1.5-flash' : provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o');
        
        let apiKey = val.apiKey || '';
        // Fallback to env vars if API key is not specified in DB config
        if (!apiKey) {
            if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY || '';
            else if (provider === 'openrouter') apiKey = process.env.OPENROUTER_API_KEY || '';
            else if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY || '';
            else if (provider === 'gemini') apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
            else if (provider === 'groq') apiKey = process.env.GROQ_API_KEY || '';
            else if (provider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY || '';
        }

        const baseUrl = val.baseUrl || '';
        const temperature = typeof val.temperature === 'number' ? val.temperature : 0.7;
        const maxTokens = typeof val.maxTokens === 'number' ? val.maxTokens : 4000;
        const systemPrompt = val.systemPrompt || '';

        return {
            key: keyToLook,
            provider,
            model,
            apiKey,
            baseUrl,
            temperature,
            maxTokens,
            systemPrompt
        };
    }

    /**
     * Generate content with full provider support and logging
     */
    async generate(request: LLMRequest): Promise<LLMResponse> {
        const startTime = Date.now();
        const featureConfig = await this.getFeatureConfig(request.feature);

        const provider = (featureConfig.provider || 'openai').toLowerCase();
        const model = request.model || featureConfig.model;
        const apiKey = featureConfig.apiKey;
        const baseUrl = featureConfig.baseUrl;
        const temperature = request.temperature ?? featureConfig.temperature ?? 0.7;
        const maxTokens = request.maxTokens ?? featureConfig.maxTokens ?? 4000;
        const systemPrompt = request.systemPrompt || featureConfig.systemPrompt || 'You are an expert AI Legal Assistant trained in Indian and International law.';

        console.log(`[LLM Service] Executing request for feature: '${request.feature || 'default'}' | Provider: '${provider}' | Model: '${model}'`);

        try {
            let response: LLMResponse;

            if (provider === 'openrouter') {
                response = await this.generateWithOpenRouter(request, model, apiKey, temperature, maxTokens, systemPrompt);
            } else if (provider === 'anthropic') {
                response = await this.generateWithAnthropic(request, model, apiKey, temperature, maxTokens, systemPrompt);
            } else if (provider === 'gemini') {
                response = await this.generateWithGemini(request, model, apiKey, temperature, maxTokens, systemPrompt);
            } else if (provider === 'groq') {
                response = await this.generateWithOpenAICompatible(request, model, apiKey, 'https://api.groq.com/openai/v1', temperature, maxTokens, systemPrompt, 'groq');
            } else if (provider === 'deepseek') {
                response = await this.generateWithOpenAICompatible(request, model, apiKey, 'https://api.deepseek.com/v1', temperature, maxTokens, systemPrompt, 'deepseek');
            } else if (provider === 'custom') {
                const customUrl = baseUrl || 'http://localhost:11434/v1';
                response = await this.generateWithOpenAICompatible(request, model, apiKey || 'ollama', customUrl, temperature, maxTokens, systemPrompt, 'custom');
            } else {
                // Default: OpenAI (or OpenAI compatible if custom baseUrl provided)
                response = await this.generateWithOpenAI(request, model, apiKey, baseUrl, temperature, maxTokens, systemPrompt);
            }

            const latencyMs = Date.now() - startTime;
            response.latencyMs = latencyMs;

            // Log successful request
            const cost = this.calculateCost(provider, model, response.tokensUsed);
            await LLMLog.create({
                feature: request.feature || 'default',
                provider: response.provider,
                model: response.model,
                promptTokens: response.promptTokens,
                completionTokens: response.completionTokens,
                totalTokens: response.tokensUsed,
                estimatedCost: cost,
                latencyMs,
                status: 'success',
                userId: request.userId
            }).catch(e => console.warn('[LLM Service] Log failed:', e.message));

            return response;
        } catch (error: any) {
            const latencyMs = Date.now() - startTime;
            console.error(`[LLM Service] Error with ${provider}/${model}:`, error.message);

            // Log error
            await LLMLog.create({
                feature: request.feature || 'default',
                provider,
                model,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                estimatedCost: 0,
                latencyMs,
                status: 'error',
                errorMessage: error.message,
                userId: request.userId
            }).catch(e => console.warn('[LLM Service] Log failed:', e.message));

            // Attempt fallback to OpenRouter or OpenAI if primary failed and wasn't already OpenRouter
            if (provider !== 'openrouter' && (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY)) {
                console.log('[LLM Service] Primary provider failed, attempting OpenRouter/OpenAI fallback...');
                try {
                    const fallbackKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';
                    if (process.env.OPENROUTER_API_KEY) {
                        return await this.generateWithOpenRouter(request, 'google/gemini-2.0-flash-001', fallbackKey, temperature, maxTokens, systemPrompt);
                    } else {
                        return await this.generateWithOpenAI(request, 'gpt-4o-mini', fallbackKey, '', temperature, maxTokens, systemPrompt);
                    }
                } catch (fallbackErr: any) {
                    console.error('[LLM Service] Fallback also failed:', fallbackErr.message);
                }
            }

            throw new Error(`LLM Generation Failed (${provider}/${model}): ${error.message}`);
        }
    }

    /**
     * Generate content using standard OpenAI API
     */
    private async generateWithOpenAI(
        request: LLMRequest,
        model: string,
        apiKey: string,
        baseUrl: string | undefined,
        temperature: number,
        maxTokens: number,
        systemPrompt: string
    ): Promise<LLMResponse> {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key) {
            throw new Error('OpenAI API key is missing. Please configure it in AI Infrastructure settings or set OPENAI_API_KEY.');
        }

        const clientOptions: any = { apiKey: key };
        if (baseUrl && baseUrl.trim().length > 0) {
            clientOptions.baseURL = baseUrl.trim();
        }

        const client = new OpenAI(clientOptions);
        const resolvedModel = model || 'gpt-4o';
        const isReasoningModel = resolvedModel.startsWith('o1') || resolvedModel.startsWith('o3');

        const messages: any[] = [];
        if (systemPrompt && systemPrompt.trim()) {
            messages.push({
                role: isReasoningModel ? 'developer' : 'system',
                content: systemPrompt.trim()
            });
        }
        if (request.history && request.history.length > 0) {
            messages.push(...request.history);
        }

        if (request.images && request.images.length > 0) {
            const userContent: any[] = [
                { type: 'text', text: request.userPrompt }
            ];
            for (const img of request.images) {
                userContent.push({
                    type: 'image_url',
                    image_url: {
                        url: img.base64.startsWith('data:') 
                            ? img.base64 
                            : `data:${img.mimeType || 'image/png'};base64,${img.base64}`,
                        detail: 'auto'
                    }
                });
            }
            messages.push({ role: 'user', content: userContent });
        } else {
            messages.push({ role: 'user', content: request.userPrompt });
        }

        const completionParams: any = {
            model: resolvedModel,
            messages
        };

        if (isReasoningModel) {
            completionParams.max_completion_tokens = maxTokens || 1500;
        } else {
            completionParams.temperature = temperature;
            completionParams.max_tokens = maxTokens;
        }

        const completion = await client.chat.completions.create(completionParams);

        const content = completion.choices[0]?.message?.content || '';
        const promptTokens = completion.usage?.prompt_tokens || 0;
        const completionTokens = completion.usage?.completion_tokens || 0;
        const tokensUsed = completion.usage?.total_tokens || (promptTokens + completionTokens);

        return {
            content,
            model: completion.model || resolvedModel,
            promptTokens,
            completionTokens,
            tokensUsed,
            provider: 'openai',
            latencyMs: 0
        };
    }

    /**
     * Generate content using OpenAI Compatible APIs (Groq, DeepSeek, Custom/Ollama)
     */
    private async generateWithOpenAICompatible(
        request: LLMRequest,
        model: string,
        apiKey: string,
        baseUrl: string,
        temperature: number,
        maxTokens: number,
        systemPrompt: string,
        providerName: string
    ): Promise<LLMResponse> {
        let key = apiKey;
        if (!key) {
            if (providerName === 'groq') key = process.env.GROQ_API_KEY || '';
            else if (providerName === 'deepseek') key = process.env.DEEPSEEK_API_KEY || '';
            else if (providerName === 'custom') key = 'ollama';
        }
        if (!key && providerName !== 'custom') {
            throw new Error(`${providerName.toUpperCase()} API key is missing. Please enter your API key in the configuration.`);
        }

        const client = new OpenAI({
            apiKey: key || 'dummy-key',
            baseURL: baseUrl
        });

        const messages: any[] = [];
        if (systemPrompt && systemPrompt.trim()) {
            messages.push({ role: 'system', content: systemPrompt.trim() });
        }
        if (request.history && request.history.length > 0) {
            messages.push(...request.history);
        }

        if (request.images && request.images.length > 0) {
            const userContent: any[] = [
                { type: 'text', text: request.userPrompt }
            ];
            for (const img of request.images) {
                userContent.push({
                    type: 'image_url',
                    image_url: {
                        url: img.base64.startsWith('data:') 
                            ? img.base64 
                            : `data:${img.mimeType || 'image/png'};base64,${img.base64}`,
                        detail: 'auto'
                    }
                });
            }
            messages.push({ role: 'user', content: userContent });
        } else {
            messages.push({ role: 'user', content: request.userPrompt });
        }

        const completion = await client.chat.completions.create({
            model: model,
            messages,
            temperature,
            max_tokens: maxTokens,
        });

        const content = completion.choices[0]?.message?.content || '';
        const promptTokens = completion.usage?.prompt_tokens || 0;
        const completionTokens = completion.usage?.completion_tokens || 0;
        const tokensUsed = completion.usage?.total_tokens || (promptTokens + completionTokens);

        return {
            content,
            model: completion.model || model,
            promptTokens,
            completionTokens,
            tokensUsed,
            provider: providerName,
            latencyMs: 0
        };
    }

    /**
     * Generate content using OpenRouter API
     */
    private async generateWithOpenRouter(
        request: LLMRequest,
        model: string,
        apiKey: string,
        temperature: number,
        maxTokens: number,
        systemPrompt: string
    ): Promise<LLMResponse> {
        const key = apiKey || process.env.OPENROUTER_API_KEY;
        if (!key) {
            throw new Error('OpenRouter API key is missing. Please configure it in AI Infrastructure settings or set OPENROUTER_API_KEY.');
        }

        let userContent: any = request.userPrompt;
        if (request.images && request.images.length > 0) {
            userContent = [
                { type: 'text', text: request.userPrompt },
                ...request.images.map(img => ({
                    type: 'image_url',
                    image_url: {
                        url: img.base64.startsWith('data:') 
                            ? img.base64 
                            : `data:${img.mimeType || 'image/png'};base64,${img.base64}`
                    }
                }))
            ];
        }

        const res = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: model || 'openai/gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(request.history || []),
                    { role: 'user', content: userContent }
                ],
                temperature,
                max_tokens: maxTokens
            },
            {
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.APP_URL || 'https://vidhikai.com',
                    'X-Title': 'Vidhik AI Platform'
                },
                timeout: 60000
            }
        );

        const content = res.data.choices[0]?.message?.content || '';
        const promptTokens = res.data.usage?.prompt_tokens || 0;
        const completionTokens = res.data.usage?.completion_tokens || 0;
        const tokensUsed = res.data.usage?.total_tokens || (promptTokens + completionTokens);

        return {
            content,
            model: res.data.model || model,
            promptTokens,
            completionTokens,
            tokensUsed,
            provider: 'openrouter',
            latencyMs: 0
        };
    }

    /**
     * Generate content using Anthropic Messages API
     */
    private async generateWithAnthropic(
        request: LLMRequest,
        model: string,
        apiKey: string,
        temperature: number,
        maxTokens: number,
        systemPrompt: string
    ): Promise<LLMResponse> {
        const key = apiKey || process.env.ANTHROPIC_API_KEY;
        if (!key) {
            // Fallback to OpenRouter if Anthropic direct key is not set
            if (process.env.OPENROUTER_API_KEY || apiKey) {
                return this.generateWithOpenRouter(request, `anthropic/${model}`, apiKey || process.env.OPENROUTER_API_KEY!, temperature, maxTokens, systemPrompt);
            }
            throw new Error('Anthropic API key is missing. Configure it in settings or set ANTHROPIC_API_KEY.');
        }

        const messages = (request.history || []).map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
        }));
        messages.push({ role: 'user', content: request.userPrompt });

        const res = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: model || 'claude-3-5-sonnet-20241022',
                system: systemPrompt,
                messages,
                max_tokens: maxTokens,
                temperature
            },
            {
                headers: {
                    'x-api-key': key,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const content = res.data.content?.[0]?.text || '';
        const promptTokens = res.data.usage?.input_tokens || 0;
        const completionTokens = res.data.usage?.output_tokens || 0;
        const tokensUsed = promptTokens + completionTokens;

        return {
            content,
            model: res.data.model || model,
            promptTokens,
            completionTokens,
            tokensUsed,
            provider: 'anthropic',
            latencyMs: 0
        };
    }

    /**
     * Generate content using Google Gemini REST API
     */
    private async generateWithGemini(
        request: LLMRequest,
        model: string,
        apiKey: string,
        temperature: number,
        maxTokens: number,
        systemPrompt: string
    ): Promise<LLMResponse> {
        const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!key) {
            throw new Error('Gemini API key is missing. Configure it in settings or set GEMINI_API_KEY.');
        }

        const geminiModel = model.startsWith('gemini') ? model : 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${key}`;

        const contents: any[] = [];
        if (request.history && request.history.length > 0) {
            for (const h of request.history) {
                contents.push({
                    role: h.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: h.content }]
                });
            }
        }
        const userParts: any[] = [{ text: request.userPrompt }];
        if (request.images && request.images.length > 0) {
            for (const img of request.images) {
                const rawBase64 = img.base64.replace(/^data:image\/\w+;base64,/, '');
                userParts.push({
                    inlineData: {
                        mimeType: img.mimeType || 'image/png',
                        data: rawBase64
                    }
                });
            }
        }
        contents.push({ role: 'user', parts: userParts });

        const requestBody: any = {
            contents,
            generationConfig: {
                temperature,
                maxOutputTokens: maxTokens
            }
        };

        if (systemPrompt && systemPrompt.trim()) {
            requestBody.systemInstruction = {
                parts: [{ text: systemPrompt.trim() }]
            };
        }

        const res = await axios.post(
            url,
            requestBody,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000
            }
        );

        const candidate = res.data.candidates?.[0];
        const content = candidate?.content?.parts?.[0]?.text || '';
        if (!content && candidate?.finishReason && candidate.finishReason !== 'STOP') {
            throw new Error(`Gemini generation stopped with status: ${candidate.finishReason}`);
        }

        const promptTokens = res.data.usageMetadata?.promptTokenCount || 0;
        const completionTokens = res.data.usageMetadata?.candidatesTokenCount || 0;
        const tokensUsed = res.data.usageMetadata?.totalTokenCount || (promptTokens + completionTokens);

        return {
            content,
            model: geminiModel,
            promptTokens,
            completionTokens,
            tokensUsed,
            provider: 'gemini',
            latencyMs: 0
        };
    }

    /**
     * Test an LLM configuration in real-time from the Admin UI
     */
    async testConnection(config: LLMTestConfig): Promise<{
        success: boolean;
        latencyMs: number;
        responseText: string;
        tokensUsed: number;
        model: string;
        provider: string;
        error?: string;
    }> {
        const startTime = Date.now();
        const promptText = config.prompt || "Hello! Respond concisely with: 'Vidhik AI LLM Service Connection Verified Successfully.'";
        
        const provider = (config.provider || 'openai').toLowerCase().trim();
        
        // Default models per provider if none or invalid provided
        const defaultModels: Record<string, string> = {
            openai: 'gpt-4o',
            openrouter: 'openai/gpt-4o',
            anthropic: 'claude-3-5-sonnet-20241022',
            gemini: 'gemini-1.5-flash',
            groq: 'llama-3.3-70b-versatile',
            deepseek: 'deepseek-chat',
            custom: 'llama3'
        };

        let model = (config.model || '').trim();
        if (!model || model === 'GPT-5.6 Luna') {
            model = defaultModels[provider] || 'gpt-4o';
        }

        let apiKey = (config.apiKey || '').trim();
        // Resolve fallback API key if not supplied in test config
        if (!apiKey) {
            if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY || '';
            else if (provider === 'openrouter') apiKey = process.env.OPENROUTER_API_KEY || '';
            else if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY || '';
            else if (provider === 'gemini') apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
            else if (provider === 'groq') apiKey = process.env.GROQ_API_KEY || '';
            else if (provider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY || '';
        }

        try {
            const testReq: LLMRequest = {
                model,
                systemPrompt: config.systemPrompt || "You are a test agent verifying system connectivity.",
                userPrompt: promptText,
                temperature: config.temperature ?? 0.3,
                maxTokens: config.maxTokens ?? 150
            };

            let result: LLMResponse;

            if (provider === 'openrouter') {
                result = await this.generateWithOpenRouter(testReq, model, apiKey, testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!);
            } else if (provider === 'anthropic') {
                result = await this.generateWithAnthropic(testReq, model, apiKey, testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!);
            } else if (provider === 'gemini') {
                result = await this.generateWithGemini(testReq, model, apiKey, testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!);
            } else if (provider === 'groq') {
                result = await this.generateWithOpenAICompatible(testReq, model, apiKey, 'https://api.groq.com/openai/v1', testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!, 'groq');
            } else if (provider === 'deepseek') {
                result = await this.generateWithOpenAICompatible(testReq, model, apiKey, 'https://api.deepseek.com/v1', testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!, 'deepseek');
            } else if (provider === 'custom') {
                const customUrl = config.baseUrl || 'http://localhost:11434/v1';
                result = await this.generateWithOpenAICompatible(testReq, model, apiKey || 'ollama', customUrl, testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!, 'custom');
            } else {
                result = await this.generateWithOpenAI(testReq, model, apiKey, config.baseUrl, testReq.temperature!, testReq.maxTokens!, testReq.systemPrompt!);
            }

            const latencyMs = Date.now() - startTime;

            // Audit log this test to LLMLog
            await LLMLog.create({
                feature: 'test_connection',
                provider: result.provider || provider,
                model: result.model || model,
                promptTokens: result.promptTokens || 0,
                completionTokens: result.completionTokens || 0,
                totalTokens: result.tokensUsed || 0,
                estimatedCost: this.calculateCost(provider, model, result.tokensUsed || 0),
                latencyMs,
                status: 'success'
            }).catch(e => console.warn('[LLM Service] Test log failed:', e.message));

            return {
                success: true,
                latencyMs,
                responseText: result.content,
                tokensUsed: result.tokensUsed,
                model: result.model,
                provider: result.provider
            };
        } catch (err: any) {
            const latencyMs = Date.now() - startTime;
            
            // Extract detailed error message
            let errorMsg = 'Connection failed';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data.slice(0, 300);
                } else if (err.response.data.error?.message) {
                    errorMsg = err.response.data.error.message;
                } else if (typeof err.response.data.error === 'string') {
                    errorMsg = err.response.data.error;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            // Audit log error to LLMLog
            await LLMLog.create({
                feature: 'test_connection',
                provider: provider || 'unknown',
                model: model || 'unknown',
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                estimatedCost: 0,
                latencyMs,
                status: 'error',
                errorMessage: errorMsg
            }).catch(e => console.warn('[LLM Service] Test error log failed:', e.message));

            return {
                success: false,
                latencyMs,
                responseText: '',
                tokensUsed: 0,
                model: model || config.model,
                provider: provider || config.provider,
                error: errorMsg
            };
        }
    }

    /**
     * Clean up markdown artifacts from generated content
     */
    cleanupMarkdown(content: string): string {
        let cleaned = content.replace(/```html|```/g, '').trim();

        cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        cleaned = cleaned.replace(/<\/?html[^>]*>/gi, '');
        cleaned = cleaned.replace(/<\/?body[^>]*>/gi, '');
        cleaned = cleaned.replace(/<\/?title[^>]*>/gi, '');
        cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');

        return cleaned.trim();
    }
}

// Export singleton instance
export const llmService = new LLMService();
