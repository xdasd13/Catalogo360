const productService = require('../services/product.service');
const catalogProducts = require('../data/catalog-products');

const buildRelatedProducts = (product) => {
  if (!product) return [];
  const matches = catalogProducts.filter(
    (item) =>
      item.id !== product.id &&
      (item.categoria === product.categoria || item.etiqueta === product.etiqueta)
  );
  return matches.slice(0, 4);
};

const productController = {
  async getAll(_req, res) {
    const products = await productService.getAll();
    res.json(products);
  },
  async getById(req, res) {
    const product = await productService.getById(req.params.id);
    res.json(product);
  },
  async create(req, res) {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  },
  async update(req, res) {
    const product = await productService.update(req.params.id, req.body);
    res.json(product);
  },
  async remove(req, res) {
    await productService.remove(req.params.id);
    res.status(204).send();
  },
  detalle(req, res) {
    const productId = Number(req.params.id);
    const product = catalogProducts.find((item) => item.id === productId) || null;
    const relacionados = buildRelatedProducts(product);

    res.render('Home/detalle', {
      product,
      relacionados,
    });
  },
};

module.exports = productController;
