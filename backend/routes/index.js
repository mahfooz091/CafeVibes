const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

// Placeholder for future modules (Phase 2+):
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/floors', floorRoutes);
// router.use('/tables', tableRoutes);
// router.use('/customers', customerRoutes);
// router.use('/coupons', couponRoutes);
// router.use('/promotions', promotionRoutes);
// router.use('/orders', orderRoutes);
// router.use('/sessions', sessionRoutes);
// router.use('/reports', reportRoutes);

module.exports = router;
