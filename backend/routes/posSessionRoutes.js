import express from 'express';
import {
  getActiveSession,
  getLastClosedSession,
  openSession,
  closeSession,
  addCashTransaction,
} from '../controllers/posSessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/active', getActiveSession);
router.get('/last-closed', getLastClosedSession);
router.post('/open', openSession);
router.post('/:id/close', closeSession);
router.post('/cash-transaction', addCashTransaction);

export default router;
