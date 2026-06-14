import express from 'express';
import {
  getActiveSession,
  getLastClosedSession,
  openSession,
  closeSession,
} from '../controllers/posSessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/active', getActiveSession);
router.get('/last-closed', getLastClosedSession);
router.post('/open', openSession);
router.post('/:id/close', closeSession);

export default router;
