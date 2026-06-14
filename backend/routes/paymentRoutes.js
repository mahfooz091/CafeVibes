import express from 'express';
import { processPayment, generateQR } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paymentValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.post('/:id/pay', paymentValidation, validate, processPayment);
router.get('/:id/qr', generateQR);

export default router;
