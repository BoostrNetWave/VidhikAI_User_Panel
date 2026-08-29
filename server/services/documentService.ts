// Document Service - Business logic for document generation
// Orchestrates prompt selection, LLM calls, and post-processing

import { llmService, LLMRequest, LLMResponse } from './llmService';
import { promptRegistry } from '../prompts/promptRegistry';
import { getDocumentType, getRecommendedModel } from '../config/documentTypes';
import { getAnalysisSystemPrompt, getAnalysisUserPrompt } from '../prompts/documentAnalysisPrompt';

export interface DocumentGenerationRequest {
    documentType: string;
    formData: any;
    userId?: string;
    customModel?: string;
}

export interface DocumentGenerationResponse {
    document: string;
    modelUsed: string;
    tokensUsed?: number;
    provider: string;
    message: string;
}

class DocumentService {
    /**
     * Generate a legal document
     */
    async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
        console.log(`[Document Service] Starting generation for: ${request.documentType}`);

        // 1. Validate document type
        const documentConfig = getDocumentType(request.documentType);
        if (!documentConfig) {
            throw new Error(`Unknown document type: ${request.documentType}`);
        }

        // 2. Get appropriate prompt
        let { systemPrompt, userPrompt } = promptRegistry.getPrompt(
            request.documentType,
            request.formData
        );

        // Inject standard formatting rules to ensure uniform premium output across all document types
        const formattingRules = `
FORMATTING RULES:
1. You MUST use <h1> for the main document title. Add inline CSS: style="font-size: 28px; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 40px;"
2. You MUST use <h2> for all major sections (e.g., COMPANY DETAILS, PRELIMINARY, DEFINITIONS). Add inline CSS: style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;"
3. You MUST use <h3> for sub-sections. Add inline CSS: style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px;"
4. Use <p> for all regular paragraphs. Add inline CSS: style="margin-bottom: 15px; line-height: 1.6; text-align: justify;"
5. Use proper HTML <table> tags if a table is generated. The table MUST have borders using inline CSS (e.g., style="border: 1px solid black; border-collapse: collapse; width: 100%; margin-top: 20px; margin-bottom: 20px;"). All <th> and <td> must have style="border: 1px solid black; padding: 10px; text-align: left;"
6. Use <strong> to highlight important names and numbers.
7. Wrap the entire document in a main container with Calibri font, 1.5 line-height, text-justify alignment, and 11pt (15px) text size:
   <div style="font-family: 'Calibri', sans-serif; line-height: 1.6; text-align: justify; font-size: 15px; color: #1a202c; padding: 10px;">
`;
        
        if (!systemPrompt.includes('FORMATTING RULES:')) {
            systemPrompt += "\n" + formattingRules;
        }

        // 3. Determine model to use
        const model = request.customModel || getRecommendedModel(request.documentType);

        console.log(`[Document Service] Using model: ${model}`);
        console.log(`[Document Service] Complexity: ${documentConfig.complexity}`);

        // 4. Generate with LLM
        const llmRequest: LLMRequest = {
            model,
            systemPrompt,
            userPrompt,
            temperature: 0.7,
            maxTokens: documentConfig.estimatedTokens || 4000,
            feature: 'doc_gen'
        };

        const llmResponse: LLMResponse = await llmService.generate(llmRequest);

        // 5. Post-process (clean up markdown, etc.)
        let cleanedContent = llmService.cleanupMarkdown(llmResponse.content);

        // 6. Log generation
        console.log(`[Document Service] Generated successfully`);
        console.log(`[Document Service] Tokens used: ${llmResponse.tokensUsed}`);

        // 7. Return result
        return {
            document: cleanedContent,
            modelUsed: llmResponse.model,
            tokensUsed: llmResponse.tokensUsed,
            provider: llmResponse.provider,
            message: `${documentConfig.name} generated successfully`
        };
    }

    /**
     * Validate form data against document requirements
     */
    validateFormData(documentType: string, formData: any): { valid: boolean; errors: string[] } {
        const documentConfig = getDocumentType(documentType);
        if (!documentConfig) {
            return { valid: false, errors: ['Unknown document type'] };
        }

        const errors: string[] = [];

        // Check required fields
        for (const field of documentConfig.requiredFields) {
            const value = formData[field];

            // Check if value exists (including boolean false)
            if (value === undefined || value === null) {
                errors.push(`Missing required field: ${field}`);
                continue;
            }

            // If it's a string, check if it's empty or only whitespace
            if (typeof value === 'string' && value.trim() === '') {
                errors.push(`Field cannot be empty: ${field}`);
                continue;
            }

            // If it's an array (like specific_powers), check if it has elements
            if (Array.isArray(value) && value.length === 0) {
                errors.push(`At least one entry is required for: ${field}`);
                continue;
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Analyze a document using OpenAI
     */
    async reviewDocument(filename: string, text: string, _userId?: string, isDeepScanEnabled: boolean = false) {
        console.log(`[Document Service] Starting ${isDeepScanEnabled ? 'DEEP' : 'STANDARD'} review for: ${filename}`);

        const llmRequest: LLMRequest = {
            model: 'gpt-4o',
            systemPrompt: getAnalysisSystemPrompt(isDeepScanEnabled),
            userPrompt: getAnalysisUserPrompt(text, filename),
            temperature: isDeepScanEnabled ? 0.2 : 0.3, // Even lower temperature for deep scan
            maxTokens: isDeepScanEnabled ? 4000 : 3000,
            feature: 'doc_review'
        };

        const llmResponse: LLMResponse = await llmService.generate(llmRequest);

        try {
            // Parse the JSON response robustly
            const content = llmResponse.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                console.error('[Document Service] No JSON found in response:', content);
                throw new Error('AI analysis failed to produce structured data');
            }

            const analysisResults = JSON.parse(jsonMatch[0]);
            console.log(`[Document Service] Review completed successfully`);
            return {
                ...analysisResults,
                fullText: text // Return original text for frontend display
            };
        } catch (error) {
            console.error('[Document Service] Failed to parse AI response:', error);
            throw new Error('AI analysis failed to produce structured data');
        }
    }
}

// Export singleton
export const documentService = new DocumentService();
