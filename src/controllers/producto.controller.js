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

const productoController = {
  detalle(req, res) {
    const productId = Number(req.params.id);
    const product = catalogProducts.find((item) => item.id === productId);
    const relacionados = buildRelatedProducts(product);

    res.render('Home/detalle', {
      product: product || null,
      relacionados,
    });
  },
};

module.exports = productoController;
