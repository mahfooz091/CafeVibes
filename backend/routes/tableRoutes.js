const express = require('express');
const router = express.Router();
const tableController = require('../controller/tableController');

router.get('/', tableController.getTables);
router.put('/:id/status', tableController.updateTableStatus);

module.exports = router;
