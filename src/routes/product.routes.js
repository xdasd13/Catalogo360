const { Router } = require('express');
const productController = require('../controllers/product.controller');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get('/', asyncHandler(productController.getAll));
router.get('/:id', asyncHandler(productController.getById));
router.post('/', asyncHandler(productController.create));
router.put('/:id', asyncHandler(productController.update));
router.delete('/:id', asyncHandler(productController.remove));

module.exports = router;
