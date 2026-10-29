import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware';
import { 
    getCasesForClient, 
    getCaseById, 
    approvePlan, 
    hireLawyer,
    bookLawyer,
    createCasePaymentOrder,
    payAndConfirmCase,
    joinMeeting,
    sendSignal,
    getSignals,
    clearSignals,
    createCase,
    selectLawyer,
    applyToCase,
    addCaseNote,
    requestMilestonePayout,
    reanalyzeCase,
    uploadCaseDocuments
} from '../controllers/caseController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for case files & documents
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `case-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: (_req, file, cb) => {
        const allowed = /pdf|doc|docx|txt|rtf|jpg|jpeg|png/;
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        if (allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Allowed file types: PDF, Word (DOC, DOCX), TXT, and Images'));
        }
    }
});

const router = Router();

router.use(protect);

router.get('/client', getCasesForClient);
router.post('/', upload.array('documents', 5), createCase);
router.post('/:id/select-lawyer', selectLawyer);
router.post('/:id/apply', applyToCase);
router.post('/hire', hireLawyer);
router.post('/book', bookLawyer);
router.post('/:id/notes', addCaseNote);
router.post('/:id/create-order', createCasePaymentOrder);
router.post('/:id/pay', payAndConfirmCase);
router.post('/:id/milestones/:index/request-payout', requestMilestonePayout);
router.post('/:id/join-meeting', joinMeeting);
router.post('/:id/signal', sendSignal);
router.get('/:id/signals', getSignals);
router.post('/:id/signals/clear', clearSignals);
router.get('/:id', getCaseById);
router.put('/:id/approve-plan', approvePlan);
router.post('/:id/documents', upload.array('documents', 5), uploadCaseDocuments);
router.post('/:id/reanalyze', reanalyzeCase);

export default router;
