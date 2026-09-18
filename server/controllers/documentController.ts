// Document Controller - HTTP handlers for document generation
// Now uses service layer architecture

import { Request, Response } from 'express';
import { documentService } from '../services/documentService';
import { getAllDocumentTypes } from '../config/documentTypes';
import Document from '../models/Document';
import SharedReview from '../models/SharedReview';
import UsageRecord from '../models/UsageRecord';
import User from '../models/User';
import mammoth from 'mammoth';
import { createRequire } from 'module';
import CreditService from '../services/creditService';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
    const parser = new pdfModule.PDFParse({ data: buffer });
    const textResult = await parser.getText();
    await parser.destroy();
    return textResult.text || '';
};

/**
 * Get all available document types
 */
export const getDocumentTypes = async (_req: Request, res: Response) => {
    try {
        const documentTypes = getAllDocumentTypes();

        res.json({
            success: true,
            count: documentTypes.length,
            data: documentTypes
        });
    } catch (error: any) {
        console.error('[Document Types] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch document types',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Generate Employment Contract (Legacy endpoint - maintained for backward compatibility)
 */
export const generateEmploymentContract = async (req: Request, res: Response) => {
    try {
        const formData = req.body;
        const userId = (req as any).user?._id || req.body.userId;

        console.log('[Employment Contract] Generation request received');

        // Calculate and deduct credits for standard document generation
        const creditPlan = CreditService.calculateDocGenCredits('employment-contract');
        try {
            await CreditService.deductCredits(userId, 'document_generation', creditPlan.featureName, creditPlan.credits);
        } catch (error: any) {
            if (error.code === 'INSUFFICIENT_CREDITS') {
                return res.status(403).json({ 
                    error: 'INSUFFICIENT_CREDITS', 
                    message: error.message,
                    required: error.required,
                    available: error.available,
                    plan: error.plan
                });
            }
            throw error;
        }

        // Use the new service layer
        let result;
        try {
            result = await documentService.generateDocument({
                documentType: 'employment-contract',
                formData,
                userId: req.body.userId,
                customModel: formData.model
            });
        } catch (genErr: any) {
            await CreditService.refundCredits(userId, creditPlan.credits, 'document_generation', genErr.message || 'Generation failed');
            throw genErr;
        }

        res.json({
            document: result.document,
            message: result.message,
            modelUsed: result.modelUsed,
            provider: result.provider,
            tokensUsed: result.tokensUsed,
            creditsUsed: creditPlan.credits,
            featureTier: creditPlan.featureName
        });

    } catch (error: any) {
        console.error('[Employment Contract] Generation Error:', error);
        res.status(500).json({
            error: 'Failed to generate employment contract',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Generate any document type (New unified endpoint)
 */
export const generateDocument = async (req: Request, res: Response) => {
    try {
        const { documentType, formData, model } = req.body;
        const userId = (req as any).user?._id || req.body.userId;

        console.log(`[Document Generation] Request for: ${documentType}`);

        // Calculate and deduct credits according to document type tier
        const creditPlan = CreditService.calculateDocGenCredits(documentType);
        try {
            await CreditService.deductCredits(userId, 'document_generation', creditPlan.featureName, creditPlan.credits);
        } catch (error: any) {
            if (error.code === 'INSUFFICIENT_CREDITS') {
                return res.status(403).json({ 
                    error: 'INSUFFICIENT_CREDITS', 
                    message: error.message,
                    required: error.required,
                    available: error.available,
                    plan: error.plan
                });
            }
            throw error;
        }

        // Validate form data
        console.log(`[Document Generation] Validating data for ${documentType}...`);
        const validation = documentService.validateFormData(documentType, formData);

        if (!validation.valid) {
            console.warn(`[Document Generation] Validation failed (missing fields):`, validation.errors);
        }
        console.log(`[Document Generation] Validation passed. Delegating to service...`);

        // Generate document
        let result;
        try {
            result = await documentService.generateDocument({
                documentType,
                formData,
                userId: req.body.userId,
                customModel: model
            });
        } catch (genErr: any) {
            await CreditService.refundCredits(userId, creditPlan.credits, 'document_generation', genErr.message || 'Generation failed');
            throw genErr;
        }

        res.json({
            success: true,
            document: result.document,
            message: result.message,
            modelUsed: result.modelUsed,
            provider: result.provider,
            tokensUsed: result.tokensUsed,
            creditsUsed: creditPlan.credits,
            featureTier: creditPlan.featureName
        });

    } catch (error: any) {
        console.error('[Document Generation] Error:', error);
        res.status(500).json({
            error: 'Failed to generate document',
            message: error?.message || 'Unknown error'
        });
    }
};
/**
 * Save a generated document to the database
 */
export const saveDocument = async (req: Request, res: Response) => {
    try {
        const { userId, title, documentType, content, formData } = req.body;

        if (!userId || !title || !documentType || !content) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'userId, title, documentType, and content are required'
            });
        }

        const newDocument = new Document({
            userId,
            title,
            documentType,
            content,
            formData: formData || {}
        });

        const savedDocument = await newDocument.save();

        res.status(201).json({
            success: true,
            message: 'Document saved successfully',
            data: savedDocument
        });
    } catch (error: any) {
        console.error('[Document Save] Error:', error);
        res.status(500).json({
            error: 'Failed to save document',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Update an existing document (content, title, status)
 */
export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, status, documentType } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const updateFields: any = { updatedAt: new Date() };
        if (title !== undefined) updateFields.title = title;
        if (content !== undefined) updateFields.content = content;
        if (status !== undefined) updateFields.status = status;
        if (documentType !== undefined) updateFields.documentType = documentType;

        const updatedDocument = await Document.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.json({
            success: true,
            message: 'Document updated successfully',
            data: updatedDocument
        });
    } catch (error: any) {
        console.error('[Update Document] Error:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Failed to update document'
        });
    }
};

/**
 * Get all documents for a specific user
 */
export const getUserDocuments = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing userId',
                message: 'userId is required in params'
            });
        }
        // Filter out documents with status 'trash'
        const documents = await Document.find({
            userId,
            status: { $ne: 'trash' }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: documents
        });
    } catch (error: any) {
        console.error('[Get User Documents] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch user documents',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'Missing document ID',
                message: 'id is required in params'
            });
        }

        const document = await Document.findByIdAndUpdate(
            id,
            { status: 'trash' },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({
                error: 'Document not found',
                message: 'No document found with the provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Document moved to trash'
        });
    } catch (error: any) {
        console.error('[Delete Document] Error:', error);
        res.status(500).json({
            error: 'Failed to move document to trash',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get all trashed documents for a specific user
 */
export const getTrashedDocuments = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'userId is required in params'
            });
        }

        const documents = await Document.find({
            userId,
            status: 'trash'
        }).sort({ updatedAt: -1 });

        res.json({
            success: true,
            data: documents
        });
    } catch (error: any) {
        console.error('[Get Trashed Documents] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch trashed documents',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Restore a document from trash
 */
export const restoreDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'Missing document ID',
                message: 'id is required in params'
            });
        }

        const document = await Document.findByIdAndUpdate(
            id,
            { status: 'draft' }, // Default back to draft when restored
            { new: true }
        );

        if (!document) {
            return res.status(404).json({
                error: 'Document not found',
                message: 'No document found with the provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Document restored successfully',
            data: document
        });
    } catch (error: any) {
        console.error('[Restore Document] Error:', error);
        res.status(500).json({
            error: 'Failed to restore document',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Permanently delete a document
 */
export const permanentlyDeleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'Missing document ID',
                message: 'id is required in params'
            });
        }

        const document = await Document.findByIdAndDelete(id);

        if (!document) {
            return res.status(404).json({
                error: 'Document not found',
                message: 'No document found with the provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Document permanently deleted'
        });
    } catch (error: any) {
        console.error('[Permanent Delete] Error:', error);
        res.status(500).json({
            error: 'Failed to permanently delete document',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Review/Analyze a document using AI
 */
export const reviewDocument = async (req: Request, res: Response) => {
    try {
        const { userId, isDeepScanEnabled } = req.body;
        const file = (req as any).file;
        const finalUserId = (req as any).user?._id || userId;
        
        const deepScan = isDeepScanEnabled === 'true' || isDeepScanEnabled === true;

        if (!file) {
            return res.status(400).json({
                error: 'Missing file',
                message: 'A file upload is required'
            });
        }
        let extractedText = '';
        const filename = file.originalname;

        console.log(`[Document Controller] Extracting text from ${filename} (${file.mimetype}). Deep Scan: ${deepScan}`);

        if (file.mimetype === 'application/pdf') {
            extractedText = await extractTextFromPDF(file.buffer);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = result.value;
        } else {
            // Fallback to text reading for other types (e.g., .txt)
            extractedText = file.buffer.toString('utf8');
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                error: 'Extraction failed',
                message: 'Could not extract text from document. Please ensure it is not an empty file or a scanned image.'
            });
        }

        // Check if the extracted text is suspiciously short (e.g., just "-- 1 of 1 --" from a scanned PDF)
        const cleanText = extractedText.replace(/\s+/g, '').trim();
        if (file.mimetype === 'application/pdf' && cleanText.length < 50) {
            return res.status(400).json({
                error: 'Image-based PDF detected',
                message: 'This PDF appears to be a scanned image or generated without a text layer. The AI requires text-based documents (like DOCX) or text-selectable PDFs to perform analysis.'
            });
        }

        console.log(`[Document Controller] Extracted ${extractedText.length} characters`);

        // Calculate credit tier based on word count & validate 50,000 words limit
        let reviewPlan;
        try {
            reviewPlan = CreditService.calculateReviewCredits(extractedText);
        } catch (wordErr: any) {
            return res.status(400).json({
                error: 'WORD_LIMIT_EXCEEDED',
                message: wordErr.message,
                words: wordErr.words,
                maxWords: wordErr.maxWords
            });
        }

        // Deduct credits (monthly first, then extra)
        try {
            await CreditService.deductCredits(
                finalUserId,
                'document_review',
                reviewPlan.featureName,
                reviewPlan.credits,
                reviewPlan.words
            );
        } catch (error: any) {
            if (error.code === 'INSUFFICIENT_CREDITS') {
                return res.status(403).json({
                    error: 'INSUFFICIENT_CREDITS',
                    message: error.message,
                    required: error.required,
                    available: error.available,
                    plan: error.plan
                });
            }
            throw error;
        }

        let analysisResults;
        try {
            analysisResults = await documentService.reviewDocument(filename, extractedText, userId, deepScan);
        } catch (revErr: any) {
            await CreditService.refundCredits(finalUserId, reviewPlan.credits, 'document_review', revErr.message || 'Review failed');
            throw revErr;
        }

        res.json({
            success: true,
            data: analysisResults,
            creditsUsed: reviewPlan.credits,
            featureTier: reviewPlan.featureName,
            wordCount: reviewPlan.words
        });
    } catch (error: any) {
        console.error('[Document Review] Error:', error);
        res.status(500).json({
            error: 'Failed to analyze document',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Upload a document directly to the user's workspace
 */
export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const { userId, title, documentType } = req.body;
        const file = (req as any).file;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing userId',
                message: 'userId is required'
            });
        }

        if (!file) {
            return res.status(400).json({
                error: 'Missing file',
                message: 'A file upload is required'
            });
        }

        let extractedText = '';
        const filename = file.originalname;

        console.log(`[Document Upload] Extracting text from ${filename} (${file.mimetype}) for user: ${userId}`);

        if (file.mimetype === 'application/pdf') {
            extractedText = await extractTextFromPDF(file.buffer);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = result.value;
        } else {
            // Fallback to text reading for other types (e.g., .txt)
            extractedText = file.buffer.toString('utf8');
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                error: 'Extraction failed',
                message: 'Could not extract text from document. Please ensure it is not empty.'
            });
        }

        // Convert the extracted text to clean paragraph-wrapped HTML
        const formattedContent = extractedText
            .split(/\n\s*\n/)
            .map(para => para.trim())
            .filter(para => para.length > 0)
            .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
            .join('\n');

        const newDocument = new Document({
            userId,
            title: title || filename,
            documentType: documentType || 'uploaded-document',
            content: formattedContent,
            formData: {},
            status: 'draft' // Default status
        });

        const savedDocument = await newDocument.save();

        res.status(201).json({
            success: true,
            message: 'Document uploaded and saved successfully',
            data: savedDocument
        });

    } catch (error: any) {
        console.error('[Document Upload] Error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
};

/**
 * Share a reviewed document (generate a public link)
 */
export const shareReview = async (req: Request, res: Response) => {
    try {
        const { fullText, analysisData, fileName } = req.body;

        if (!fullText || !analysisData || !fileName) {
            return res.status(400).json({ error: 'Missing required fields for sharing.' });
        }

        const sharedReview = await SharedReview.create({
            fullText,
            analysisData,
            fileName
        });

        res.json({
            success: true,
            id: sharedReview._id
        });
    } catch (error: any) {
        console.error('[Document Review] Error sharing:', error);
        res.status(500).json({ error: 'Failed to generate share link.' });
    }
};

/**
 * Get a shared review by ID
 */
export const getSharedReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sharedReview = await SharedReview.findById(id);

        if (!sharedReview) {
            return res.status(404).json({ error: 'Shared document not found or link expired.' });
        }

        res.json({
            success: true,
            data: sharedReview
        });
    } catch (error: any) {
        console.error('[Document Review] Error fetching shared review:', error);
        res.status(500).json({ error: 'Failed to fetch shared document.' });
    }
};
