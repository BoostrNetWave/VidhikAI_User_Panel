// LLM Service - Abstraction layer for AI model interactions
// Supports multiple providers: OpenRouter, OpenAI, Anthropic

import axios, { AxiosError } from 'axios';
import OpenAI from 'openai';
import SystemConfig from '../models/SystemConfig';

export interface LLMRequest {
    model: string;
    systemPrompt: string;
    userPrompt: string;
    history?: { role: 'user' | 'assistant' | 'system'; content: string }[];
    temperature?: number;
    maxTokens?: number;
    feature?: 'default' | 'chatbot' | 'doc_gen' | 'doc_review';
}

export interface LLMResponse {
    content: string;
    model: string;
    tokensUsed?: number;
    provider: 'openrouter' | 'openai' | 'sarvam';
}

class LLMService {
    private openaiClient: OpenAI | null = null;
    // private sarvamApiKey: string | null = null;

    constructor() {
        console.log('[LLM Service] Initializing...');
        console.log('[LLM Service] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
        console.log('[LLM Service] OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
        // console.log('[LLM Service] SARVAM_API_KEY:', process.env.SARVAM_API_KEY ? 'SET' : 'NOT SET');

        if (process.env.OPENAI_API_KEY) {
            this.openaiClient = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            console.log('[LLM Service] OpenAI configured');
        }

        // if (process.env.SARVAM_API_KEY) {
        //     this.sarvamApiKey = process.env.SARVAM_API_KEY;
        //     console.log('[LLM Service] Sarvam API configured');
        // }
    }

    /**
     * Generate content using OpenRouter
     */
    async generateWithOpenRouter(request: LLMRequest, dynamicApiKey?: string): Promise<LLMResponse> {
        const apiKey = dynamicApiKey || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: request.model,
                    messages: [
                        { role: 'system', content: request.systemPrompt },
                        ...(request.history || []),
                        { role: 'user', content: request.userPrompt }
                    ],
                    temperature: request.temperature || 0.7,
                    max_tokens: request.maxTokens || 4000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5007',
                        'X-Title': 'Vidhik AI - Legal Document Generator'
                    }
                }
            );

            return {
                content: response.data.choices[0]?.message?.content || '',
                model: response.data.model,
                tokensUsed: response.data.usage?.total_tokens,
                provider: 'openrouter'
            };
        } catch (error: any) {
            const axiosError = error as AxiosError;
            throw new Error(
                `OpenRouter failed: ${axiosError.response?.data || axiosError.message}`
            );
        }
    }

    /**
     * Generate content using OpenAI
     */
    async generateWithOpenAI(request: LLMRequest, dynamicApiKey?: string): Promise<LLMResponse> {
        let client = this.openaiClient;
        if (dynamicApiKey) {
            client = new OpenAI({ apiKey: dynamicApiKey });
        }

        if (!client && process.env.OPENAI_API_KEY) {
            client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            this.openaiClient = client;
        }

        if (!client) {
            throw new Error('OpenAI client not configured');
        }

        try {
            const completion = await client.chat.completions.create({
                model: request.model,
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    ...(request.history || []),
                    { role: 'user', content: request.userPrompt }
                ],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || 4000,
            });

            return {
                content: completion.choices[0].message.content || '',
                model: completion.model,
                tokensUsed: completion.usage?.total_tokens,
                provider: 'openai'
            };
        } catch (error: any) {
            throw new Error(`OpenAI failed: ${error.message}`);
        }
    }

    /**
     * Generate content using Sarvam AI (Deprecated)
     */
    /*
    async generateWithSarvam(request: LLMRequest): Promise<LLMResponse> {
        if (!this.sarvamApiKey) {
            throw new Error('Sarvam API key not configured');
        }

        try {
            console.log('[LLM Service] Calling Sarvam API...');
            console.log('[LLM Service] Model:', request.model);
            console.log('[LLM Service] System prompt length:', request.systemPrompt.length);
            console.log('[LLM Service] User prompt length:', request.userPrompt.length);

            const response = await axios.post(
                'https://api.sarvam.ai/v1/chat/completions',
                {
                    model: request.model,
                    messages: [
                        { role: 'system', content: request.systemPrompt },
                        { role: 'user', content: request.userPrompt }
                    ],
                    temperature: request.temperature || 0.7,
                    max_tokens: request.maxTokens || 4000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.sarvamApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000 // 60 second timeout
                }
            );

            console.log('[LLM Service] Sarvam API call successful!');
            console.log('[LLM Service] Response model:', response.data.model);
            console.log('[LLM Service] Content length:', response.data.choices[0]?.message?.content?.length || 0);

            return {
                content: response.data.choices[0]?.message?.content || '',
                model: response.data.model || request.model,
                tokensUsed: response.data.usage?.total_tokens,
                provider: 'sarvam'
            };
        } catch (error: any) {
            const axiosError = error as AxiosError;
            const errorDetails = axiosError.response?.data ? JSON.stringify(axiosError.response.data) : axiosError.message;

            console.error(`[LLM Service] Sarvam API Error Details:`, errorDetails);
            console.error(`[LLM Service] Sarvam API Status:`, axiosError.response?.status);
            throw new Error(
                `Sarvam AI failed: ${errorDetails}`
            );
        }
    }
    */

    /**
     * Generate content with automatic fallback
     * Tries Sarvam first, then OpenAI, then OpenRouter
     */
    async generate(request: LLMRequest): Promise<LLMResponse> {
        let activeModel = request.model;
        let activeProvider = 'openai'; // default assumption based on code
        let activeApiKey = '';

        try {
            // Determine feature key
            let configKey = 'LLM_CONFIG_DEFAULT';
            if (request.feature === 'chatbot') configKey = 'LLM_CONFIG_CHATBOT';
            else if (request.feature === 'doc_gen') configKey = 'LLM_CONFIG_DOC_GEN';
            else if (request.feature === 'doc_review') configKey = 'LLM_CONFIG_DOC_REVIEW';

            let config = await SystemConfig.findOne({ key: configKey });
            if (!config || !config.value || !config.value.apiKey) {
                // fallback to default if feature config is missing or empty
                if (configKey !== 'LLM_CONFIG_DEFAULT') {
                    config = await SystemConfig.findOne({ key: 'LLM_CONFIG_DEFAULT' });
                }
            }

            if (config && config.value && config.value.apiKey) {
                activeProvider = config.value.provider || 'openai';
                activeModel = config.value.model || request.model;
                activeApiKey = config.value.apiKey;
                console.log(`[LLM Service] Using DB Config - Provider: ${activeProvider}, Model: ${activeModel}, Feature: ${request.feature || 'default'}`);
            } else {
                 console.log(`[LLM Service] Using environment fallback for model: ${activeModel}`);
            }
        } catch (err) {
            console.error('[LLM Service] Error fetching DB config, falling back to env:', err);
        }

        const requestWithModel = { ...request, model: activeModel };

        // If DB config specified openrouter
        if (activeProvider === 'openrouter' && activeApiKey) {
            try {
                const result = await this.generateWithOpenRouter(requestWithModel, activeApiKey);
                return result;
            } catch (error: any) {
                console.warn(`[LLM Service] OpenRouter (DB Config) failed: ${error.message}`);
            }
        }

        // Try OpenAI (DB config or fallback to env)
        if (activeProvider === 'openai' || this.openaiClient) {
            try {
                // If model was still sarvam (e.g. from cache or old request), defaults to gpt-4o
                const modelToUse = requestWithModel.model.includes('gpt') ? requestWithModel.model : 'gpt-4o';
                const result = await this.generateWithOpenAI({
                    ...requestWithModel,
                    model: modelToUse
                }, activeApiKey);
                console.log(`[LLM Service] Success with OpenAI`);
                return result;
            } catch (error: any) {
                console.warn(`[LLM Service] OpenAI failed: ${error.message}`);
            }
        }

        // Fallback to OpenRouter (if not already tried)
        if (activeProvider !== 'openrouter') {
            try {
                console.log(`[LLM Service] Attempting OpenRouter fallback...`);
                const result = await this.generateWithOpenRouter(requestWithModel, activeApiKey);
                console.log(`[LLM Service] Success with OpenRouter`);
                return result;
            } catch (error: any) {
                console.error(`[LLM Service] OpenRouter fallback failed: ${error.message}`);
                // If all failed
                console.error(`[LLM Service] CRITICAL: All LLM providers failed for model ${activeModel}`);
                throw new Error(`All LLM providers failed. Last error: ${error.message}`);
            }
        } else {
             throw new Error(`All LLM providers failed.`);
        }
    }

    /**
     * Clean up markdown artifacts from generated content
     */
    cleanupMarkdown(content: string): string {
        // Remove markdown code blocks
        let cleaned = content.replace(/```html|```/g, '').trim();

        // Remove <html>, <head>, <body>, <style>, <title> tags and their contents (for head/style)
        // This prevents global style leaks and invalid HTML nesting
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
