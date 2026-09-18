import { Response } from 'express';
import Document from '../models/Document';
import Case from '../models/Case';
import User from '../models/User';
import UsageRecord from '../models/UsageRecord';
import SystemConfig from '../models/SystemConfig';
import CreditService, { PLAN_CREDIT_ALLOCATIONS } from '../services/creditService';

export const getDashboardStats = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;

        // 1. Total Documents generated (not trashed)
        const totalDocuments = await Document.countDocuments({
            userId,
            status: { $ne: 'trash' }
        });

        // 2. Pending Reviews (documents in draft status or without analysis results, and not trashed)
        const pendingReviews = await Document.countDocuments({
            userId,
            analysisResults: null,
            status: { $ne: 'trash' }
        });

        // 3. Active Consultations (cases where client is user and status is 'active')
        const activeConsultations = await Case.countDocuments({
            client: userId,
            status: 'active'
        });

        const totalConsultations = await Case.countDocuments({
            client: userId
        });

        // 4. AI Credits and Subscription Plan details
        const user = await User.findById(userId);
        if (user) {
            await CreditService.syncUserSubscription(user);
        }

        const plan = user ? user.subscription : 'Free';
        const monthlyAllowance = PLAN_CREDIT_ALLOCATIONS[plan] ?? 30;
        const monthlyCreditsRemaining = user ? (user.monthlyCredits ?? monthlyAllowance) : 30;
        const extraCreditsRemaining = user ? (user.extraCredits ?? 0) : 0;
        const aiCredits = user ? user.aiCredits : 30;
        const renewsAt = user ? user.subscriptionRenewsAt : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // 5. Calculate billing cycle start date (accurately linked to subscription renewal)
        const now = new Date();
        let cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);
        if (user && user.subscriptionRenewsAt) {
            const renewDate = new Date(user.subscriptionRenewsAt);
            const cycleDays = user.subscriptionBillingCycle === 'yearly' ? 365 : 30;
            const computedStart = new Date(renewDate.getTime() - cycleDays * 24 * 60 * 60 * 1000);
            if (computedStart <= now) {
                cycleStart = computedStart;
            }
        }

        // Fetch usage records for current billing cycle
        const monthlyRecords = await UsageRecord.find({
            userId,
            createdAt: { $gte: cycleStart },
            creditsUsed: { $gt: 0 }
        });

        const creditsUsedThisMonth = monthlyRecords.reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
        const docsCreditsUsed = monthlyRecords.filter(r => r.featureType === 'document_generation').reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
        const reviewsCreditsUsed = monthlyRecords.filter(r => r.featureType === 'document_review').reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
        const researchCreditsUsed = monthlyRecords.filter(r => r.featureType === 'legal_research').reduce((sum, r) => sum + (r.creditsUsed || 0), 0);

        const docsUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'document_generation',
            createdAt: { $gte: cycleStart }
        });

        const reviewsUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'document_review',
            createdAt: { $gte: cycleStart }
        });

        const researchUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'legal_research',
            createdAt: { $gte: cycleStart }
        });

        // 6. Fetch plan limits from database
        let planLimits = {
            monthlyCredits: monthlyAllowance,
            maxChatWords: 5000,
            maxDocGenWords: 2000,
            maxDocReviewWords: 5000
        };

        try {
            const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
            if (plansConfig && Array.isArray(plansConfig.value)) {
                const matchedPlan = plansConfig.value.find((p: any) => p.name?.toLowerCase() === plan.toLowerCase());
                if (matchedPlan?.limits) {
                    planLimits = {
                        monthlyCredits: matchedPlan.limits.monthlyCredits || monthlyAllowance,
                        maxChatWords: matchedPlan.limits.maxChatWords || 5000,
                        maxDocGenWords: matchedPlan.limits.maxDocGenWords || 2000,
                        maxDocReviewWords: matchedPlan.limits.maxDocReviewWords || 5000
                    };
                }
            }
        } catch (cfgErr) {
            console.warn('[Dashboard Stats] Warning loading plan limits config:', cfgErr);
        }

        res.json({
            success: true,
            data: {
                totalDocuments,
                pendingReviews,
                activeConsultations,
                totalConsultations,
                aiCredits,
                monthlyCreditsRemaining,
                extraCreditsRemaining,
                monthlyAllowance,
                creditsUsedThisMonth,
                cycleStart,
                renewsAt,
                plan,
                billingCycle: user?.subscriptionBillingCycle || 'monthly',
                usage: {
                    documents: docsUsage,
                    reviews: reviewsUsage,
                    research: researchUsage,
                    documentsCredits: docsCreditsUsed,
                    reviewsCredits: reviewsCreditsUsed,
                    researchCredits: researchCreditsUsed
                },
                limits: planLimits
            }
        });
    } catch (error: any) {
        console.error('[Dashboard Stats] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard stats',
            message: error?.message || 'Unknown error'
        });
    }
};

export const getCreditUsageHistory = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;

        // Return all transactions (usage deductions, top-up packages, subscription renewals, and refunds)
        const history = await UsageRecord.find({
            userId
        }).sort({ createdAt: -1 }).limit(100);

        res.json({
            success: true,
            data: history
        });
    } catch (error: any) {
        console.error('[Dashboard Credit Usage] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch credit usage history',
            message: error?.message || 'Unknown error'
        });
    }
};
