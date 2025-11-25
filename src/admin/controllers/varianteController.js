const varianteController = {
  async listar(req, res) {
    res.render('admin/pages/variantes/lista', {
      layout: 'admin/layouts/main',
      title: 'Variantes',
      currentPage: 'variantes'
    });
  },
  async crear(req, res) {
    res.status(201).json({ message: 'Variante creada' });
  },
  async editar(req, res) {
    res.json({ message: 'Variante actualizada' });
  },
  async eliminar(req, res) {
    res.json({ message: 'Variante eliminada' });
  }
};

module.exports = varianteController;
