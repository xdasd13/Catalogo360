const stockController = {
  async listar(req, res) {
    res.render('admin/pages/stock/lista', {
      layout: 'admin/layouts/main',
      title: 'Gestión de Stock',
      currentPage: 'stock'
    });
  },
  async actualizar(req, res) {
    res.json({ message: 'Stock actualizado' });
  }
};

module.exports = stockController;
