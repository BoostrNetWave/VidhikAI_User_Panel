import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats, getCreditUsageHistory } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', protect, getDashboardStats);
router.get('/credit-usage', protect, getCreditUsageHistory);

export default router;
