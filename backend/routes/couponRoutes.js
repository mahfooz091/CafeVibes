import express from 'express';
import {
  getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon,
  getPromotions, createPromotion, updatePromotion, deletePromotion,
} from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/coupons')
  .get(getCoupons)
  .post(authorize('admin'), createCoupon);

router.post('/coupons/validate', validateCoupon);

router.route('/coupons/:id')
  .put(authorize('admin'), updateCoupon)
  .delete(authorize('admin'), deleteCoupon);

router.route('/promotions')
  .get(getPromotions)
  .post(authorize('admin'), createPromotion);

router.route('/promotions/:id')
  .put(authorize('admin'), updatePromotion)
  .delete(authorize('admin'), deletePromotion);

export default router;
