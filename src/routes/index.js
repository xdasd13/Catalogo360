const { Router } = require('express');
const productRoutes = require('./product.routes');
const currencyRoutes = require('./currency.routes');

const router = Router();

router.use('/products', productRoutes);
router.use('/currency', currencyRoutes);

module.exports = router;
