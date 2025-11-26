const { Router } = require('express');
const productController = require('../controllers/product.controller');

const router = Router();

router.get('/producto/:id', productController.detalle);

module.exports = router;
