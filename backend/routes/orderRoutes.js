const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.put('/:id/pay', orderController.completeOrderPayment);

module.exports = router;
