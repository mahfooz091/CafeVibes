import express from 'express';
import { getReceiptHTML, downloadReceiptPDF, emailReceipt } from '../controllers/receiptController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:id/html', getReceiptHTML);
router.get('/:id/pdf', downloadReceiptPDF);
router.post('/:id/email', emailReceipt);

export default router;
