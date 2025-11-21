const HttpError = require('../errors/http-error');
const productRepository = require('../repositories/product.repository');

const productService = {
  async getAll() {
    return productRepository.findAll();
  },

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new HttpError(404, `Producto con id ${id} no encontrado`);
    }
    return product;
  },

  async create(payload) {
    const { name, price, stock } = payload;
    if (!name || price === undefined || stock === undefined) {
      throw new HttpError(400, 'name, price y stock son obligatorios');
    }
    return productRepository.create({ name, price, stock });
  },

  async update(id, payload) {
    await this.getById(id);
    const { name, price, stock } = payload;
    if (!name || price === undefined || stock === undefined) {
      throw new HttpError(400, 'name, price y stock son obligatorios');
    }
    return productRepository.update(id, { name, price, stock });
  },

  async remove(id) {
    await this.getById(id);
    await productRepository.remove(id);
    return { id };
  },
};

module.exports = productService;
