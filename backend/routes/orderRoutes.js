import express from 'express';
import {
  getOrders, getOrder, createOrder, updateOrder, cancelOrder,
  updateKitchenItemStatus, getKitchenOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { orderValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/kitchen', getKitchenOrders);
router.route('/').get(getOrders).post(orderValidation, validate, createOrder);
router.route('/:id').get(getOrder).put(orderValidation, validate, updateOrder);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/kitchen', updateKitchenItemStatus);

export default router;
