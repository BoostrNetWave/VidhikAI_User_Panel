import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    createSupportTicket,
    getUserSupportTickets,
    getTicketById,
    replyToTicketAsCustomer
} from '../controllers/supportController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadPath = () => {
    const lawyerUploadsPath = path.join(__dirname, '../../../lawyer-admin-main/backend/uploads');
    if (fs.existsSync(lawyerUploadsPath)) {
        return lawyerUploadsPath;
    }
    const localUploadsPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(localUploadsPath)) {
        fs.mkdirSync(localUploadsPath, { recursive: true });
    }
    return localUploadsPath;
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getUploadPath());
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'ticket-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const router = Router();

router.use(protect);

// Create a new support ticket (with optional attachment)
router.post('/', upload.single('attachment'), createSupportTicket);

// Get all support tickets submitted by logged-in user
router.get('/', getUserSupportTickets);

// Get a single ticket by ID
router.get('/:id', getTicketById);

// Customer reply to existing ticket (with optional attachment)
router.post('/:id/reply', upload.single('attachment'), replyToTicketAsCustomer);

export default router;
