const { Router } = require('express');
const currencyController = require('../controllers/currency.controller');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get('/latest', asyncHandler(currencyController.getLatest));

module.exports = router;
