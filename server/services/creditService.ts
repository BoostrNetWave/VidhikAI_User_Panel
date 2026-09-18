import mongoose from 'mongoose';
import User from '../models/User';
import UsageRecord from '../models/UsageRecord';

export const PLAN_CREDIT_ALLOCATIONS: Record<string, number> = {
    'Free': 30,
    'Starter': 150,
    'Growth': 500,
    'Enterprise': 5000
};

export const EXTRA_CREDIT_PACKAGES = [
    { id: 'extra-50', credits: 50, price: 199, desc: '50 Extra AI Credits' },
    { id: 'extra-100', credits: 100, price: 349, desc: '100 Extra AI Credits' },
    { id: 'extra-250', credits: 250, price: 749, desc: '250 Extra AI Credits' },
    { id: 'extra-500', credits: 500, price: 1299, desc: '500 Extra AI Credits' },
    { id: 'extra-1000', credits: 1000, price: 2299, desc: '1,000 Extra AI Credits' }
];

export const FEATURE_RULES = {
    // Legal Chat
    SIMPLE_LEGAL_CHAT: { name: 'Simple Legal Chat', credits: 1, maxWords: 2000 },
    DETAILED_LEGAL_CHAT: { name: 'Detailed Legal Chat', credits: 3, maxWords: 5000 },
    ADVANCED_LEGAL_CHAT: { name: 'Advanced Legal Chat', credits: 5, maxWords: 10000 },
    
    // Document Generation
    BASIC_DOC_GEN: { name: 'Basic Document Generation', credits: 5, maxWords: 2000 },
    STANDARD_DOC_GEN: { name: 'Standard Document Generation', credits: 10, maxWords: 5000 },
    ADVANCED_DOC_GEN: { name: 'Advanced Document Generation', credits: 20, maxWords: 10000 },
    LARGE_DOC_GEN: { name: 'Large Document Generation', credits: 30, maxWords: 15000 },

    // Document Review
    SHORT_DOC_REVIEW: { name: 'Short Document Review', credits: 5, maxWords: 5000 },
    STANDARD_DOC_REVIEW: { name: 'Standard Document Review', credits: 10, maxWords: 15000 },
    ADVANCED_DOC_REVIEW: { name: 'Advanced Document Review', credits: 20, maxWords: 30000 },
    LARGE_DOC_REVIEW: { name: 'Large Document Review', credits: 30, maxWords: 50000 }
};

export class CreditService {
    /**
     * Count words cleanly from text content
     */
    static countWords(text: string): number {
        if (!text || typeof text !== 'string') return 0;
        const clean = text.trim();
        if (!clean) return 0;
        return clean.split(/\s+/).length;
    }

    /**
     * Check if user subscription renewal cycle has passed. If so, reset monthly credits.
     * Also initializes uninitialized credits for legacy/new users.
     */
    static async syncUserSubscription(user: any): Promise<any> {
        let changed = false;
        const rawPlan = (user.subscription || 'Free').toString().trim();
        let planName = 'Free';
        if (rawPlan.toLowerCase() === 'growth' || rawPlan.toLowerCase() === 'enterprise' || rawPlan.toLowerCase() === 'business') {
            planName = 'Growth';
        } else if (rawPlan.toLowerCase() === 'starter' || rawPlan.toLowerCase() === 'pro' || rawPlan.toLowerCase() === 'professional') {
            planName = 'Starter';
        } else {
            planName = 'Free';
        }

        if (user.subscription !== planName) {
            user.subscription = planName;
            changed = true;
        }

        const planQuota = PLAN_CREDIT_ALLOCATIONS[planName] ?? 30;

        if (user.monthlyCredits === undefined || user.monthlyCredits === null) {
            user.monthlyCredits = planQuota;
            changed = true;
        }

        if (user.extraCredits === undefined || user.extraCredits === null) {
            user.extraCredits = 0;
            changed = true;
        }

        const now = new Date();
        if (!user.subscriptionRenewsAt) {
            user.subscriptionRenewsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            changed = true;
        } else if (now >= new Date(user.subscriptionRenewsAt)) {
            // Subscription cycle has renewed: Monthly credits reset (unused monthly credits do not roll over)
            console.log(`[CreditService] Resetting monthly credits for user ${user._id} (${user.email}) on ${planName} plan`);
            user.monthlyCredits = planQuota;
            
            // Set next billing renewal date
            const currentRenewal = new Date(user.subscriptionRenewsAt);
            while (now >= currentRenewal) {
                currentRenewal.setDate(currentRenewal.getDate() + 30);
            }
            user.subscriptionRenewsAt = currentRenewal;
            changed = true;

            await UsageRecord.create({
                userId: user._id,
                featureType: 'subscription_grant',
                featureName: `${planName} Monthly Renewal`,
                creditsUsed: 0,
                subscriptionPlan: planName,
                notes: `Reset monthly allocation to ${planQuota} credits.`
            });
        }

        // Recalculate total aiCredits
        const total = (user.monthlyCredits || 0) + (user.extraCredits || 0);
        if (user.aiCredits !== total) {
            user.aiCredits = total;
            changed = true;
        }

        if (changed) {
            await user.save();
        }

        return user;
    }

    /**
     * Calculate credit cost and validate word limit for Legal Research / Chat
     */
    static calculateChatCredits(queryAndContext: string): { credits: number; featureName: string; words: number } {
        const words = this.countWords(queryAndContext);
        if (words > FEATURE_RULES.ADVANCED_LEGAL_CHAT.maxWords) {
            const err = new Error(`Query context length (${words} words) exceeds maximum limit of ${FEATURE_RULES.ADVANCED_LEGAL_CHAT.maxWords} words.`);
            (err as any).code = 'WORD_LIMIT_EXCEEDED';
            (err as any).words = words;
            (err as any).maxWords = FEATURE_RULES.ADVANCED_LEGAL_CHAT.maxWords;
            throw err;
        }

        if (words <= FEATURE_RULES.SIMPLE_LEGAL_CHAT.maxWords) {
            return { credits: FEATURE_RULES.SIMPLE_LEGAL_CHAT.credits, featureName: FEATURE_RULES.SIMPLE_LEGAL_CHAT.name, words };
        } else if (words <= FEATURE_RULES.DETAILED_LEGAL_CHAT.maxWords) {
            return { credits: FEATURE_RULES.DETAILED_LEGAL_CHAT.credits, featureName: FEATURE_RULES.DETAILED_LEGAL_CHAT.name, words };
        } else {
            return { credits: FEATURE_RULES.ADVANCED_LEGAL_CHAT.credits, featureName: FEATURE_RULES.ADVANCED_LEGAL_CHAT.name, words };
        }
    }

    /**
     * Calculate credit cost and validate word limit for Document Review
     */
    static calculateReviewCredits(extractedText: string): { credits: number; featureName: string; words: number } {
        const words = this.countWords(extractedText);
        if (words > FEATURE_RULES.LARGE_DOC_REVIEW.maxWords) {
            const err = new Error(`Document length (${words.toLocaleString()} words) exceeds maximum review limit of ${FEATURE_RULES.LARGE_DOC_REVIEW.maxWords.toLocaleString()} words.`);
            (err as any).code = 'WORD_LIMIT_EXCEEDED';
            (err as any).words = words;
            (err as any).maxWords = FEATURE_RULES.LARGE_DOC_REVIEW.maxWords;
            throw err;
        }

        if (words <= FEATURE_RULES.SHORT_DOC_REVIEW.maxWords) {
            return { credits: FEATURE_RULES.SHORT_DOC_REVIEW.credits, featureName: FEATURE_RULES.SHORT_DOC_REVIEW.name, words };
        } else if (words <= FEATURE_RULES.STANDARD_DOC_REVIEW.maxWords) {
            return { credits: FEATURE_RULES.STANDARD_DOC_REVIEW.credits, featureName: FEATURE_RULES.STANDARD_DOC_REVIEW.name, words };
        } else if (words <= FEATURE_RULES.ADVANCED_DOC_REVIEW.maxWords) {
            return { credits: FEATURE_RULES.ADVANCED_DOC_REVIEW.credits, featureName: FEATURE_RULES.ADVANCED_DOC_REVIEW.name, words };
        } else {
            return { credits: FEATURE_RULES.LARGE_DOC_REVIEW.credits, featureName: FEATURE_RULES.LARGE_DOC_REVIEW.name, words };
        }
    }

    /**
     * Calculate credit cost for Document Generation based on document type complexity
     */
    static calculateDocGenCredits(documentType: string): { credits: number; featureName: string } {
        const type = (documentType || '').toLowerCase();

        // Advanced agreements
        if (
            type.includes('share-subscription') || 
            type.includes('shareholder') || 
            type.includes('commercial-lease') || 
            type.includes('partnership') ||
            type.includes('founder')
        ) {
            return { credits: FEATURE_RULES.ADVANCED_DOC_GEN.credits, featureName: `${FEATURE_RULES.ADVANCED_DOC_GEN.name} (${documentType})` };
        }

        // Basic simple agreements
        if (
            type.includes('nda') || 
            type.includes('non-disclosure') || 
            type.includes('affidavit') || 
            type.includes('notice') ||
            type.includes('power-of-attorney')
        ) {
            return { credits: FEATURE_RULES.BASIC_DOC_GEN.credits, featureName: `${FEATURE_RULES.BASIC_DOC_GEN.name} (${documentType})` };
        }

        // Standard default (employment contract, service agreement, rental agreement, etc.)
        return { credits: FEATURE_RULES.STANDARD_DOC_GEN.credits, featureName: `${FEATURE_RULES.STANDARD_DOC_GEN.name} (${documentType})` };
    }

    /**
     * Deduct credits from user account.
     * Consumption order: Monthly subscription credits FIRST, then Extra credits.
     */
    static async deductCredits(
        userId: string | mongoose.Types.ObjectId,
        featureType: 'document_generation' | 'document_review' | 'legal_research',
        featureName: string,
        requiredCredits: number,
        wordCount: number = 0,
        requestId?: string
    ): Promise<{ user: any; monthlyDeducted: number; extraDeducted: number }> {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('User not found');
            (err as any).code = 'USER_NOT_FOUND';
            throw err;
        }

        await this.syncUserSubscription(user);

        const availableTotal = (user.monthlyCredits || 0) + (user.extraCredits || 0);

        if (availableTotal < requiredCredits) {
            const err = new Error(`Insufficient AI credits. Required: ${requiredCredits} credits, Available: ${availableTotal} credits. Please upgrade your subscription plan or buy an Extra Credits pack.`);
            (err as any).code = 'INSUFFICIENT_CREDITS';
            (err as any).required = requiredCredits;
            (err as any).available = availableTotal;
            (err as any).plan = user.subscription || 'Free';
            throw err;
        }

        let monthlyDeducted = 0;
        let extraDeducted = 0;

        if (user.monthlyCredits >= requiredCredits) {
            user.monthlyCredits -= requiredCredits;
            monthlyDeducted = requiredCredits;
        } else {
            monthlyDeducted = user.monthlyCredits;
            const remainder = requiredCredits - user.monthlyCredits;
            user.monthlyCredits = 0;
            user.extraCredits = Math.max(0, (user.extraCredits || 0) - remainder);
            extraDeducted = remainder;
        }

        user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);
        await user.save();

        // Write ledger record
        await UsageRecord.create({
            userId: user._id,
            featureType,
            featureName,
            creditsUsed: requiredCredits,
            wordCount,
            subscriptionPlan: user.subscription || 'Free',
            requestId: requestId || '',
            notes: `Deducted ${monthlyDeducted} monthly credits and ${extraDeducted} extra credits.`
        });

        console.log(`[CreditService] Deducted ${requiredCredits} credits for ${user.email} (${featureName}). Remaining: ${user.aiCredits} (${user.monthlyCredits} monthly + ${user.extraCredits} extra)`);

        return { user, monthlyDeducted, extraDeducted };
    }

    /**
     * Restore/Refund credits on API failure
     */
    static async refundCredits(
        userId: string | mongoose.Types.ObjectId,
        credits: number,
        featureType: string,
        reason: string
    ): Promise<void> {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            user.monthlyCredits = (user.monthlyCredits || 0) + credits;
            user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);
            await user.save();

            await UsageRecord.create({
                userId: user._id,
                featureType: 'refund',
                featureName: `Refund: ${featureType}`,
                creditsUsed: -credits,
                subscriptionPlan: user.subscription || 'Free',
                notes: `Restored ${credits} credits due to error: ${reason}`
            });

            console.log(`[CreditService] Refunded ${credits} credits to ${user.email}. Total balance: ${user.aiCredits}`);
        } catch (err) {
            console.error('[CreditService] Failed to refund credits:', err);
        }
    }
}

export default CreditService;
