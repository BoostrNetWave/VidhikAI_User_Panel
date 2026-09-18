import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/authMiddleware';
import { 
    getSubscriptionPlans, 
    changeSubscriptionPlan, 
    purchaseExtraCredits 
} from '../controllers/subscriptionController';

const router = Router();

router.get('/plans', optionalAuth, getSubscriptionPlans);
router.post('/change-plan', protect, changeSubscriptionPlan);
router.post('/purchase-extra-credits', protect, purchaseExtraCredits);

export default router;
