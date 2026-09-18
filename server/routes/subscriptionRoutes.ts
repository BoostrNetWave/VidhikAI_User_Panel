import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/authMiddleware';
import { 
    getSubscriptionPlans, 
    createPaymentOrder,
    verifyPayment,
    handleRazorpayWebhook,
    getUserTransactions,
    changeSubscriptionPlan, 
    purchaseExtraCredits 
} from '../controllers/subscriptionController';

const router = Router();

// Public / Authenticated Plan Information
router.get('/plans', optionalAuth, getSubscriptionPlans);

// Razorpay Payment Flow Endpoints
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/webhook', handleRazorpayWebhook);
router.get('/transactions', protect, getUserTransactions);

// Compatibility Routes (route through createPaymentOrder)
router.post('/change-plan', protect, changeSubscriptionPlan);
router.post('/purchase-extra-credits', protect, purchaseExtraCredits);

export default router;

