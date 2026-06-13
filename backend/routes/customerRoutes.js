const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);

module.exports = router;
