const express = require('express');
const router = express.Router();
const staffController = require('../controller/staffController');

router.get('/', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);

module.exports = router;
