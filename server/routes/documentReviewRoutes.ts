import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, adminOnly } from '../middleware/authMiddleware';
import {
    createReviewRequest,
    getUserReviewRequests,
    getReviewRequestById,
    createReviewPaymentOrder,
    verifyReviewPayment,
    acceptReview,
    getAllReviewRequestsAdmin,
    sendReviewQuoteAdmin,
    submitCompletedReviewAdmin,
    cancelReviewRequest,
    joinReviewMeeting,
    sendReviewSignal,
    getReviewSignals,
    clearReviewSignals
} from '../controllers/documentReviewController';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch {}
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `reviewed-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// User routes
router.post('/', protect, createReviewRequest);
router.get('/my', protect, getUserReviewRequests);
router.get('/:id', protect, getReviewRequestById);
router.post('/:id/payment-order', protect, createReviewPaymentOrder);
router.post('/:id/verify-payment', protect, verifyReviewPayment);
router.post('/:id/accept', protect, acceptReview);
router.post('/:id/cancel', protect, cancelReviewRequest);

// Real-time video consultation & signaling for document reviews (both client and lawyer/admin)
router.post('/:id/join-meeting', protect, joinReviewMeeting);
router.post('/:id/signal', protect, sendReviewSignal);
router.get('/:id/signals', protect, getReviewSignals);
router.post('/:id/signals/clear', protect, clearReviewSignals);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllReviewRequestsAdmin);
router.post('/admin/:id/quote', protect, adminOnly, sendReviewQuoteAdmin);
router.post('/admin/:id/complete', protect, adminOnly, upload.single('file'), submitCompletedReviewAdmin);

export default router;

