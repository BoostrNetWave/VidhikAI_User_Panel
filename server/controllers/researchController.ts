import { Response } from 'express';
import { llmService } from '../services/llmService';
import { getResearchSystemPrompt, getResearchUserPrompt } from '../prompts/researchPrompt';
import Research from '../models/Research';
import UsageRecord from '../models/UsageRecord';

export const handleLegalResearch = async (req: any, res: Response) => {
    try {
        const { query, model, history } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        console.log(`[Research Controller] Performing research for: ${query} using model: ${model}. History length: ${history ? history.length : 0}`);

        // Clean and format history to match LLMRequest's expected format
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
            content: msg.content
        }));

        const isFollowUp = formattedHistory.length > 0;

        const result = await llmService.generate({
            model: model || 'gpt-4o',
            systemPrompt: getResearchSystemPrompt(),
            userPrompt: getResearchUserPrompt(query, isFollowUp),
            history: formattedHistory
        });

        // Log usage in UsageRecord
        await UsageRecord.create({
            userId: req.user._id,
            featureType: 'legal_research'
        });

        res.json({
            answer: result.content,
            provider: result.provider,
            model: result.model
        });
    } catch (error: any) {
        console.error('[Research Controller] Error performing research:', error);
        res.status(500).json({ error: 'Failed to perform legal research' });
    }
};

export const getResearchHistory = async (req: any, res: Response) => {
    try {
        const history = await Research.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(history.map(item => ({
            id: item._id,
            title: item.title,
            description: item.query,
            date: `Researched ${new Date(item.createdAt).toLocaleDateString()}`,
            createdAt: item.createdAt,
            category: item.category,
            answer: item.answer
        })));
    } catch (error: any) {
        console.error('[Research Controller] Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch research history' });
    }
};

export const saveResearch = async (req: any, res: Response) => {
    try {
        const { query, answer, title, category } = req.body;

        if (!query || !answer) {
            return res.status(400).json({ error: 'Query and answer are required' });
        }

        const newResearch = new Research({
            userId: req.user._id,
            query,
            answer,
            title: title || (query.length > 50 ? query.substring(0, 50) + '...' : query),
            category: category || 'General Research'
        });

        await newResearch.save();

        res.status(201).json({ message: 'Research saved successfully', data: newResearch });
    } catch (error: any) {
        console.error('[Research Controller] Error saving research:', error);
        res.status(500).json({ error: 'Failed to save research' });
    }
};

export const deleteResearch = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Research ID is required' });
        }

        const deletedResearch = await Research.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedResearch) {
            return res.status(404).json({ error: 'Research record not found' });
        }

        res.json({ message: 'Research deleted successfully' });
    } catch (error: any) {
        console.error('[Research Controller] Error deleting research:', error);
        res.status(500).json({ error: 'Failed to delete research' });
    }
};

export const clearAllHistory = async (req: any, res: Response) => {
    try {
        await Research.deleteMany({ userId: req.user._id });
        res.json({ message: 'All research history cleared successfully' });
    } catch (error: any) {
        console.error('[Research Controller] Error clearing history:', error);
        res.status(500).json({ error: 'Failed to clear research history' });
    }
};
