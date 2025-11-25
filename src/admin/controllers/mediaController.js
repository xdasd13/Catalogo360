const mediaController = {
  async listar(req, res) {
    res.render('admin/pages/media/lista', {
      layout: 'admin/layouts/main',
      title: 'Galería de Imágenes',
      currentPage: 'media'
    });
  },
  async subir(req, res) {
    res.status(201).json({ message: 'Imagen subida' });
  },
  async eliminar(req, res) {
    res.json({ message: 'Imagen eliminada' });
  }
};

module.exports = mediaController;
