import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { checkUserLimit } from '../middleware/limitMiddleware';
import { 
    getCasesForClient, 
    getCaseById, 
    approvePlan, 
    hireLawyer,
    bookLawyer,
    payAndConfirmCase,
    joinMeeting,
    sendSignal,
    getSignals,
    clearSignals,
    createCase,
    addCaseNote
} from '../controllers/caseController';

const router = Router();

router.use(protect);

router.get('/client', getCasesForClient);
router.post('/', createCase);
router.post('/hire', hireLawyer);
router.post('/book', bookLawyer);
router.post('/:id/notes', addCaseNote);
router.post('/:id/pay', payAndConfirmCase);
router.post('/:id/join-meeting', joinMeeting);
router.post('/:id/signal', sendSignal);
router.get('/:id/signals', getSignals);
router.post('/:id/signals/clear', clearSignals);
router.get('/:id', getCaseById);
router.put('/:id/approve-plan', approvePlan);

export default router;
