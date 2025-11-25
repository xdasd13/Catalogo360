const configController = {
  async listar(req, res) {
    res.render('admin/pages/config/index', {
      layout: 'admin/layouts/main',
      title: 'Configuración',
      currentPage: 'config'
    });
  },
  async actualizar(req, res) {
    res.json({ message: 'Configuración actualizada' });
  }
};

module.exports = configController;
