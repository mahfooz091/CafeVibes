const express = require('express');
const router = express.Router();
const menuController = require('../controller/menuController');

router.get('/', menuController.getMenuItems);
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
