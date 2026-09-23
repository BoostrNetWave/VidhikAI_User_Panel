import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    createConsultation,
    getConsultationsForClient,
    getConsultationById,
    acceptConsultation,
    proposeConsultationTime,
    payAndConfirmConsultation,
    uploadConsultationDocument,
    cancelConsultation,
    sendConsultationSignal,
    getConsultationSignals,
    clearConsultationSignals,
    joinConsultation,
    endConsultation
} from '../controllers/consultationController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage pointing to lawyer backend uploads directory
const getUploadPath = () => {
    const lawyerUploadsPath = path.join(__dirname, '../../../lawyer-admin-main/backend/uploads');
    if (fs.existsSync(lawyerUploadsPath)) {
        return lawyerUploadsPath;
    }
    // Fallback/create local uploads if lawyer uploads doesn't exist
    const localUploadsPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(localUploadsPath)) {
        fs.mkdirSync(localUploadsPath, { recursive: true });
    }
    return localUploadsPath;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadPath());
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'consult-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images, PDFs, and Word documents are allowed'));
        }
    }
});

const router = Router();

router.use(protect);

router.post('/', createConsultation);
router.get('/', getConsultationsForClient);
router.get('/:id', getConsultationById);
router.post('/:id/accept', acceptConsultation);
router.post('/:id/propose', proposeConsultationTime);
router.post('/:id/pay', payAndConfirmConsultation);
router.post('/:id/upload', upload.single('file'), uploadConsultationDocument);
router.post('/:id/cancel', cancelConsultation);
router.post('/:id/join', joinConsultation);
router.post('/:id/end', endConsultation);
router.post('/:id/signal', sendConsultationSignal);
router.post('/:id/signals', sendConsultationSignal);
router.get('/:id/signals', getConsultationSignals);
router.post('/:id/signals/clear', clearConsultationSignals);

export default router;
