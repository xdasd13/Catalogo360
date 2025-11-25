const seoController = {
  async listar(req, res) {
    res.render('admin/pages/seo/lista', {
      layout: 'admin/layouts/main',
      title: 'Gestión SEO',
      currentPage: 'seo'
    });
  },
  async editarForm(req, res) {
    res.render('admin/pages/seo/editar', {
      layout: 'admin/layouts/main',
      title: 'Editar SEO',
      currentPage: 'seo'
    });
  },
  async editar(req, res) {
    res.json({ message: 'SEO actualizado' });
  }
};

module.exports = seoController;
