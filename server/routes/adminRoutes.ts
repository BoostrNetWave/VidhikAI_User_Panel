import express from 'express';
import { 
    getConfigs, 
    updateConfig, 
    getAllUsers, 
    getPendingLawyers, 
    approveLawyer, 
    getPublicLawyers, 
    verifyUser, 
    getAllCases, 
    approveMilestonePayout, 
    rejectMilestonePayout, 
    getPublicLawyerById,
    getAllTickets,
    replyToTicket,
    getAllDocuments,
    getUserDetails,
    updateUserSubscription,
    getAllConsultations,
    getLoginHistory
} from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Admin Routes
 * Protected by 'protect' (JWT Check) and 'adminOnly' (Role Check)
 */

router.get('/config', protect, adminOnly, getConfigs);
router.put('/config', protect, adminOnly, updateConfig);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/pending-lawyers', protect, adminOnly, getPendingLawyers);
router.post('/approve-lawyer/:id', protect, adminOnly, approveLawyer);
router.post('/verify-user/:id', protect, adminOnly, verifyUser);
router.get('/cases', protect, adminOnly, getAllCases);
router.post('/cases/:id/milestones/:index/approve-payout', protect, adminOnly, approveMilestonePayout);
router.post('/cases/:id/milestones/:index/reject-payout', protect, adminOnly, rejectMilestonePayout);

// Tickets & Documents management
router.get('/tickets', protect, adminOnly, getAllTickets);
router.post('/tickets/:id/reply', protect, adminOnly, replyToTicket);
router.get('/documents', protect, adminOnly, getAllDocuments);
router.get('/users/:id/details', protect, adminOnly, getUserDetails);
router.post('/users/:id/subscription', protect, adminOnly, updateUserSubscription);
router.get('/consultations', protect, adminOnly, getAllConsultations);
router.get('/login-history', protect, adminOnly, getLoginHistory);

// Public routes (No auth required)
router.get('/public/config', getConfigs);
router.get('/public/lawyers', getPublicLawyers);
router.get('/public/lawyers/:id', getPublicLawyerById);

export default router;
