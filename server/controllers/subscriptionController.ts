import { Response } from 'express';
import User from '../models/User';
import SystemConfig from '../models/SystemConfig';
import UsageRecord from '../models/UsageRecord';
import Transaction from '../models/Transaction';
import CreditService, { PLAN_CREDIT_ALLOCATIONS, EXTRA_CREDIT_PACKAGES } from '../services/creditService';
import razorpayService from '../services/razorpayService';

// Default baseline plans
const DEFAULT_PLANS = [
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
    },
    { 
        id: "enterprise",
        name: "Enterprise", 
        priceMonthly: 0, 
        priceYearly: 0, 
        monthlyCredits: 5000,
        desc: "Full-scale enterprise access, admin-assigned only", 
        features: [
            "5,000 Monthly AI Credits", 
            "Unlimited Legal Chat context", 
            "Full Document Generation access", 
            "Full Document Review access",
            "Dedicated priority support",
            "Admin-assigned plan"
        ], 
        gradient: "from-slate-900 to-slate-700", 
        popular: false, 
        iconName: "Shield"
    }
];

/**
 * Get all subscription plans, extra credit packages, user balance, and Razorpay Public Key
 */
export const getSubscriptionPlans = async (req: any, res: Response) => {
    try {
        let plans = DEFAULT_PLANS;
        let extraPackages = EXTRA_CREDIT_PACKAGES;

        // Fetch configured plans from DB
        const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
        if (plansConfig && Array.isArray(plansConfig.value) && plansConfig.value.length > 0) {
            plans = plansConfig.value;
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
                        cta: isCurrent ? 'Current Active Plan' : (p.priceMonthly === 0 ? 'Downgrade to Free' : `Upgrade to ${p.name}`)
                    };
                });
            }
        }

        res.json({
            success: true,
            data: {
                plans,
                extraCreditPackages: extraPackages,
                userSubscription,
                razorpayKeyId: razorpayService.getKeyId()
            }
        });
    } catch (error: any) {
        console.error('[Subscription Controller] Error fetching plans:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a Razorpay Payment Order for Plan Subscription or Extra Credits
 * For Free plan: directly activates without creating a Razorpay order.
 */
export const createPaymentOrder = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const { type, planName, billingCycle = 'monthly', packageId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        // 1. Handle Plan Subscription Order
        if (type === 'plan' || (!type && planName)) {
            // Find plan definition
            let plans = DEFAULT_PLANS;
            const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
            if (plansConfig && Array.isArray(plansConfig.value) && plansConfig.value.length > 0) {
                plans = plansConfig.value;
            }

            const targetPlan = plans.find((p: any) => p.name.toLowerCase() === (planName || '').toLowerCase());
            if (!targetPlan) {
                return res.status(400).json({ success: false, message: `Invalid plan name: ${planName}` });
            }

            // Price calculation server-side (prevent client manipulation)
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? targetPlan.priceYearly : targetPlan.priceMonthly;

            // FREE PLAN HANDLING: No payment needed!
            if (price === 0 || targetPlan.name.toLowerCase() === 'free') {
                const previousPlan = user.subscription || 'Free';
                user.subscription = 'Free';
                user.subscriptionBillingCycle = 'monthly';
                user.monthlyCredits = PLAN_CREDIT_ALLOCATIONS['Free'] || 30;
                user.subscriptionStartedAt = new Date();
                user.subscriptionRenewsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);
                await user.save();

                // Audit ledger & transaction
                await UsageRecord.create({
                    userId: user._id,
                    featureType: 'subscription_grant',
                    featureName: `Plan Change: ${previousPlan} -> Free`,
                    creditsUsed: 0,
                    subscriptionPlan: 'Free',
                    notes: `Activated Free plan (30 monthly credits).`
                });

                await Transaction.create({
                    userId: user._id,
                    orderId: `free_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    type: 'plan_subscription',
                    planName: 'Free',
                    billingCycle: 'monthly',
                    amount: 0,
                    currency: 'INR',
                    status: 'paid',
                    creditsGranted: 30,
                    paymentMethod: 'free',
                    notes: { directActivation: true }
                });

                return res.json({
                    success: true,
                    isFree: true,
                    message: 'Free Plan activated successfully!',
                    data: {
                        plan: 'Free',
                        monthlyCredits: user.monthlyCredits,
                        extraCredits: user.extraCredits,
                        totalCredits: user.aiCredits,
                        renewsAt: user.subscriptionRenewsAt
                    }
                });
            }

            // PAID PLAN: Create Razorpay Order
            const receiptId = `rcpt_plan_${Date.now().toString().slice(-8)}`;
            const notes = {
                userId: user._id.toString(),
                userEmail: user.email,
                type: 'plan_subscription',
                planName: targetPlan.name,
                billingCycle: isYearly ? 'yearly' : 'monthly'
            };

            const order = await razorpayService.createOrder(price, receiptId, notes);

            // Record transaction in DB with status 'created'
            await Transaction.create({
                userId: user._id,
                orderId: order.id,
                type: 'plan_subscription',
                planName: targetPlan.name,
                billingCycle: isYearly ? 'yearly' : 'monthly',
                amount: price,
                currency: 'INR',
                status: 'created',
                creditsGranted: targetPlan.monthlyCredits || PLAN_CREDIT_ALLOCATIONS[targetPlan.name] || 150,
                notes
            });

            return res.json({
                success: true,
                isFree: false,
                order: {
                    id: order.id,
                    amount: order.amount, // in paise
                    currency: order.currency,
                    keyId: razorpayService.getKeyId(),
                    name: 'Vidhik AI',
                    description: `${targetPlan.name} Plan (${isYearly ? 'Annual' : 'Monthly'})`,
                    prefill: {
                        name: user.fullName,
                        email: user.email,
                        contact: user.phone || ''
                    },
                    theme: {
                        color: '#0f172a'
                    }
                },
                item: {
                    type: 'plan',
                    name: targetPlan.name,
                    billingCycle: isYearly ? 'yearly' : 'monthly',
                    amount: price,
                    credits: targetPlan.monthlyCredits
                }
            });
        }

        // 2. Handle Extra Credits Package Order
        if (type === 'package' || packageId) {
            let packages = EXTRA_CREDIT_PACKAGES;
            const packagesConfig = await SystemConfig.findOne({ key: 'EXTRA_CREDIT_PACKAGES' });
            if (packagesConfig && Array.isArray(packagesConfig.value) && packagesConfig.value.length > 0) {
                packages = packagesConfig.value;
            }

            const pkg = packages.find(p => p.id === packageId);
            if (!pkg) {
                return res.status(400).json({ success: false, message: 'Invalid extra credit package selected.' });
            }

            const receiptId = `rcpt_pkg_${Date.now().toString().slice(-8)}`;
            const notes = {
                userId: user._id.toString(),
                userEmail: user.email,
                type: 'extra_credits',
                packageId: pkg.id,
                credits: pkg.credits
            };

            const order = await razorpayService.createOrder(pkg.price, receiptId, notes);

            // Record transaction in DB with status 'created'
            await Transaction.create({
                userId: user._id,
                orderId: order.id,
                type: 'extra_credits',
                packageId: pkg.id,
                amount: pkg.price,
                currency: 'INR',
                status: 'created',
                creditsGranted: pkg.credits,
                notes
            });

            return res.json({
                success: true,
                isFree: false,
                order: {
                    id: order.id,
                    amount: order.amount, // in paise
                    currency: order.currency,
                    keyId: razorpayService.getKeyId(),
                    name: 'Vidhik AI',
                    description: `${pkg.credits.toLocaleString()} Extra AI Credits`,
                    prefill: {
                        name: user.fullName,
                        email: user.email,
                        contact: user.phone || ''
                    },
                    theme: {
                        color: '#0f172a'
                    }
                },
                item: {
                    type: 'package',
                    name: `${pkg.credits} Extra AI Credits`,
                    amount: pkg.price,
                    credits: pkg.credits
                }
            });
        }

        return res.status(400).json({ success: false, message: 'Invalid order request. Must specify plan or extra credits package.' });

    } catch (error: any) {
        console.error('[Subscription Controller] Error creating payment order:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to initialize payment order.' });
    }
};

/**
 * Verify Razorpay Payment Signature and provision credits / plan
 */
export const verifyPayment = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required Razorpay payment verification parameters.'
            });
        }

        // 1. Verify cryptographic HMAC-SHA256 signature
        const isValid = razorpayService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error(`[Razorpay Verification] Signature mismatch for order: ${razorpay_order_id}`);
            await Transaction.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { 
                    status: 'failed', 
                    paymentId: razorpay_payment_id, 
                    signature: razorpay_signature,
                    errorReason: 'Cryptographic signature mismatch'
                }
            );
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: Signature mismatch.'
            });
        }

        // 2. Find Transaction record
        const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction record not found.' });
        }

        if (transaction.status === 'paid') {
            return res.json({
                success: true,
                message: 'Payment already verified and processed.',
                data: {
                    orderId: transaction.orderId,
                    paymentId: transaction.paymentId,
                    amount: transaction.amount
                }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // 3. Provision Subscription or Extra Credits
        if (transaction.type === 'plan_subscription') {
            const planName = transaction.planName || 'Starter';
            const billingCycle = transaction.billingCycle || 'monthly';
            const previousPlan = user.subscription || 'Free';
            const newQuota = transaction.creditsGranted || PLAN_CREDIT_ALLOCATIONS[planName] || 150;

            user.subscription = planName;
            user.subscriptionBillingCycle = billingCycle;
            user.monthlyCredits = newQuota;
            user.subscriptionStartedAt = new Date();

            const daysToAdd = billingCycle === 'yearly' ? 365 : 30;
            user.subscriptionRenewsAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
            user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);

            await user.save();

            // Record in ledger
            await UsageRecord.create({
                userId: user._id,
                featureType: 'subscription_grant',
                featureName: `Upgraded to ${planName} (${billingCycle})`,
                creditsUsed: 0,
                subscriptionPlan: planName,
                notes: `Razorpay Payment ID: ${razorpay_payment_id}. Amount: ₹${transaction.amount}. Quota: ${newQuota} monthly credits.`
            });

            // Mark transaction as paid
            transaction.status = 'paid';
            transaction.paymentId = razorpay_payment_id;
            transaction.signature = razorpay_signature;
            await transaction.save();

            console.log(`[Subscription Verified] User ${user.email} successfully upgraded from ${previousPlan} to ${planName} (Order: ${razorpay_order_id})`);

            return res.json({
                success: true,
                message: `Payment successful! Your ${planName} Plan is now active.`,
                data: {
                    plan: user.subscription,
                    billingCycle: user.subscriptionBillingCycle,
                    monthlyCredits: user.monthlyCredits,
                    extraCredits: user.extraCredits,
                    totalCredits: user.aiCredits,
                    renewsAt: user.subscriptionRenewsAt,
                    paymentId: razorpay_payment_id
                }
            });
        } else if (transaction.type === 'extra_credits') {
            const credits = transaction.creditsGranted || 100;
            user.extraCredits = (user.extraCredits || 0) + credits;
            user.aiCredits = (user.monthlyCredits || 0) + user.extraCredits;
            await user.save();

            // Record in ledger
            await UsageRecord.create({
                userId: user._id,
                featureType: 'extra_credits_purchase',
                featureName: `Purchased ${credits} Extra Credits`,
                creditsUsed: -credits, // Added balance
                subscriptionPlan: user.subscription || 'Free',
                notes: `Razorpay Payment ID: ${razorpay_payment_id}. Amount: ₹${transaction.amount}.`
            });

            // Mark transaction as paid
            transaction.status = 'paid';
            transaction.paymentId = razorpay_payment_id;
            transaction.signature = razorpay_signature;
            await transaction.save();

            console.log(`[Extra Credits Verified] User ${user.email} received ${credits} extra credits (Order: ${razorpay_order_id})`);

            return res.json({
                success: true,
                message: `Payment successful! Added ${credits} Extra AI Credits to your account.`,
                data: {
                    addedCredits: credits,
                    monthlyCredits: user.monthlyCredits,
                    extraCredits: user.extraCredits,
                    totalCredits: user.aiCredits,
                    paymentId: razorpay_payment_id
                }
            });
        }

    } catch (error: any) {
        console.error('[Subscription Controller] Error verifying payment:', error);
        res.status(500).json({ success: false, message: error.message || 'Payment verification failed.' });
    }
};

/**
 * Razorpay Webhook Handler for asynchronous payment capture
 */
export const handleRazorpayWebhook = async (req: any, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        if (!signature) {
            return res.status(400).json({ success: false, message: 'Missing webhook signature.' });
        }

        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const isValid = razorpayService.verifyWebhookSignature(rawBody, signature as string);

        if (!isValid) {
            console.error('[Razorpay Webhook] Invalid webhook signature');
            return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log(`[Razorpay Webhook] Received Event: ${event}`);

        if (event === 'payment.captured' || event === 'order.paid') {
            const paymentEntity = payload.payment?.entity;
            const orderId = paymentEntity?.order_id || payload.order?.entity?.id;
            const paymentId = paymentEntity?.id;

            if (orderId) {
                const transaction = await Transaction.findOne({ orderId });
                if (transaction && transaction.status !== 'paid') {
                    transaction.status = 'paid';
                    transaction.paymentId = paymentId;
                    transaction.paymentMethod = paymentEntity?.method;
                    await transaction.save();

                    const user = await User.findById(transaction.userId);
                    if (user) {
                        if (transaction.type === 'plan_subscription') {
                            user.subscription = transaction.planName || 'Starter';
                            user.subscriptionBillingCycle = transaction.billingCycle || 'monthly';
                            user.monthlyCredits = transaction.creditsGranted || 150;
                            user.subscriptionStartedAt = new Date();
                            const days = transaction.billingCycle === 'yearly' ? 365 : 30;
                            user.subscriptionRenewsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                            user.aiCredits = (user.monthlyCredits || 0) + (user.extraCredits || 0);
                            await user.save();
                        } else if (transaction.type === 'extra_credits') {
                            user.extraCredits = (user.extraCredits || 0) + transaction.creditsGranted;
                            user.aiCredits = (user.monthlyCredits || 0) + user.extraCredits;
                            await user.save();
                        }
                    }
                }
            }
        }

        res.json({ status: 'ok' });
    } catch (error: any) {
        console.error('[Razorpay Webhook Error]:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get user payment & transaction history
 */
export const getUserTransactions = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: transactions
        });
    } catch (error: any) {
        console.error('[Subscription Controller] Error fetching transactions:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Direct Plan Change (Maintained for Free Plan switch)
 */
export const changeSubscriptionPlan = async (req: any, res: Response) => {
    // Delegate to createPaymentOrder which handles Free plan immediately
    return createPaymentOrder(req, res);
};

/**
 * Direct Extra Credits Purchase (Legacy - redirected to Razorpay)
 */
export const purchaseExtraCredits = async (req: any, res: Response) => {
    // Delegate to createPaymentOrder which sets up Razorpay order
    req.body.type = 'package';
    return createPaymentOrder(req, res);
};
