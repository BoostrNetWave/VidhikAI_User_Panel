import { Response } from 'express';
import User from '../models/User';
import SystemConfig from '../models/SystemConfig';
import UsageRecord from '../models/UsageRecord';
import CreditService, { PLAN_CREDIT_ALLOCATIONS, EXTRA_CREDIT_PACKAGES } from '../services/creditService';

/**
 * Get all subscription plans, extra credit packages, and user balance
 */
export const getSubscriptionPlans = async (req: any, res: Response) => {
    try {
        let plans = [];
        let extraPackages = EXTRA_CREDIT_PACKAGES;

        // Fetch configured plans from DB
        const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
        if (plansConfig && Array.isArray(plansConfig.value) && plansConfig.value.length > 0) {
            plans = plansConfig.value;
        } else {
            // Fallback to default v3.0 plans
            plans = [
                { 
                    id: "free",
                    name: "Free", 
                    priceMonthly: 0, 
                    priceYearly: 0, 
                    monthlyCredits: 30,
                    desc: "Perfect for getting started with AI legal assistance", 
                    features: [
                        "30 Monthly AI Credits", 
                        "Simple & Detailed Legal Chat (1–3 credits)", 
                        "Basic Document Generation (5 credits)", 
                        "Short Document Review (up to 5,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Credits reset each billing cycle"
                    ], 
                    gradient: "from-slate-500 to-slate-600", 
                    popular: false, 
                    iconName: "Zap"
                },
                { 
                    id: "starter",
                    name: "Starter", 
                    priceMonthly: 499, 
                    priceYearly: 4990, 
                    monthlyCredits: 150,
                    desc: "Designed for individuals, freelancers & emerging startups", 
                    features: [
                        "150 Monthly AI Credits", 
                        "Advanced Legal Chat (up to 10,000 words)", 
                        "Standard Document Generation (10 credits)", 
                        "Standard Document Review (up to 15,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Priority AI processing speed"
                    ], 
                    gradient: "from-accent to-purple-500", 
                    popular: true, 
                    bestValue: true,
                    iconName: "Crown"
                },
                { 
                    id: "growth",
                    name: "Growth", 
                    priceMonthly: 1499, 
                    priceYearly: 14990, 
                    monthlyCredits: 500,
                    desc: "For growing businesses, law chambers & comprehensive legal operations", 
                    features: [
                        "500 Monthly AI Credits", 
                        "All Legal Chat tiers with extended context", 
                        "Large Document Generation (up to 15,000 words)", 
                        "Large Document Review (up to 50,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Maximum AI speed & priority support"
                    ], 
                    gradient: "from-indigo-500 to-blue-600", 
                    popular: false, 
                    iconName: "Building2"
                }
            ];
        }

        const packagesConfig = await SystemConfig.findOne({ key: 'EXTRA_CREDIT_PACKAGES' });
        if (packagesConfig && Array.isArray(packagesConfig.value) && packagesConfig.value.length > 0) {
            extraPackages = packagesConfig.value;
        }

        let userSubscription: any = null;

        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user) {
                await CreditService.syncUserSubscription(user);

                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const records = await UsageRecord.find({
                    userId: user._id,
                    createdAt: { $gte: startOfMonth },
                    creditsUsed: { $gt: 0 }
                });

                const creditsUsedThisMonth = records.reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
                const planName = user.subscription || 'Free';
                const monthlyAllowance = PLAN_CREDIT_ALLOCATIONS[planName] ?? 30;

                userSubscription = {
                    plan: planName,
                    billingCycle: user.subscriptionBillingCycle || 'monthly',
                    monthlyCredits: user.monthlyCredits ?? monthlyAllowance,
                    extraCredits: user.extraCredits ?? 0,
                    totalCredits: user.aiCredits ?? ((user.monthlyCredits ?? monthlyAllowance) + (user.extraCredits ?? 0)),
                    monthlyAllowance,
                    creditsUsedThisMonth,
                    renewsAt: user.subscriptionRenewsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                };

                // Annotate plans with current status
                plans = plans.map((p: any) => {
                    const isCurrent = p.name.toLowerCase() === planName.toLowerCase();
                    return {
                        ...p,
                        current: isCurrent,
                        disabled: isCurrent,
                        cta: isCurrent ? 'Current Active Plan' : `Upgrade to ${p.name}`
                    };
                });
            }
        }

        res.json({
            success: true,
            data: {
                plans,
                extraCreditPackages: extraPackages,
                userSubscription
            }
        });
    } catch (error: any) {
        console.error('[Subscription Controller] Error fetching plans:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Change / Upgrade / Downgrade subscription plan
 */
export const changeSubscriptionPlan = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const { planName, billingCycle = 'monthly' } = req.body;

        const validPlans = ['Free', 'Starter', 'Growth'];
        const targetPlan = validPlans.find(p => p.toLowerCase() === (planName || '').toLowerCase());

        if (!targetPlan) {
            return res.status(400).json({ success: false, message: `Invalid plan name. Must be one of: ${validPlans.join(', ')}` });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const previousPlan = user.subscription || 'Free';
        const newQuota = PLAN_CREDIT_ALLOCATIONS[targetPlan] || 30;

        user.subscription = targetPlan;
        user.subscriptionBillingCycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
        user.monthlyCredits = newQuota; // Reset monthly allocation to new plan tier
        user.subscriptionStartedAt = new Date();
        
        const daysToAdd = user.subscriptionBillingCycle === 'yearly' ? 365 : 30;
        user.subscriptionRenewsAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
        user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);

        await user.save();

        // Audit ledger entry
        await UsageRecord.create({
            userId: user._id,
            featureType: 'subscription_grant',
            featureName: `Plan Change: ${previousPlan} -> ${targetPlan}`,
            creditsUsed: 0,
            subscriptionPlan: targetPlan,
            notes: `Activated ${targetPlan} (${user.subscriptionBillingCycle}) with ${newQuota} monthly credits.`
        });

        console.log(`[Subscription Controller] User ${user.email} changed plan from ${previousPlan} to ${targetPlan} (${newQuota} credits)`);

        res.json({
            success: true,
            message: `Subscription successfully updated to ${targetPlan}!`,
            data: {
                plan: user.subscription,
                billingCycle: user.subscriptionBillingCycle,
                monthlyCredits: user.monthlyCredits,
                extraCredits: user.extraCredits,
                totalCredits: user.aiCredits,
                renewsAt: user.subscriptionRenewsAt
            }
        });
    } catch (error: any) {
        console.error('[Subscription Controller] Error changing plan:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Purchase an Extra Credits package
 */
export const purchaseExtraCredits = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const { packageId } = req.body;

        const pkg = EXTRA_CREDIT_PACKAGES.find(p => p.id === packageId);
        if (!pkg) {
            return res.status(400).json({ success: false, message: 'Invalid extra credit package selected.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await CreditService.syncUserSubscription(user);

        user.extraCredits = (user.extraCredits || 0) + pkg.credits;
        user.aiCredits = (user.monthlyCredits || 0) + user.extraCredits;
        await user.save();

        // Record in ledger
        await UsageRecord.create({
            userId: user._id,
            featureType: 'extra_credits_purchase',
            featureName: `Purchased ${pkg.credits} Extra Credits`,
            creditsUsed: -pkg.credits, // Credited
            subscriptionPlan: user.subscription || 'Free',
            notes: `Payment of ₹${pkg.price} confirmed for package ${pkg.id}.`
        });

        console.log(`[Subscription Controller] User ${user.email} purchased ${pkg.credits} extra credits. New total: ${user.aiCredits}`);

        res.json({
            success: true,
            message: `Successfully purchased ${pkg.credits} extra AI credits!`,
            data: {
                addedCredits: pkg.credits,
                monthlyCredits: user.monthlyCredits,
                extraCredits: user.extraCredits,
                totalCredits: user.aiCredits
            }
        });
    } catch (error: any) {
        console.error('[Subscription Controller] Error purchasing extra credits:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
