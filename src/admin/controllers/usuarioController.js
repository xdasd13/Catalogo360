const usuarioController = {
  async listar(req, res) {
    res.render('admin/pages/usuarios/lista', {
      layout: 'admin/layouts/main',
      title: 'Usuarios',
      currentPage: 'usuarios'
    });
  },
  async crearForm(req, res) {
    res.render('admin/pages/usuarios/crear', {
      layout: 'admin/layouts/main',
      title: 'Nuevo Usuario',
      currentPage: 'usuarios'
    });
  },
  async crear(req, res) {
    res.status(201).json({ message: 'Usuario creado' });
  },
  async editarForm(req, res) {
    res.render('admin/pages/usuarios/editar', {
      layout: 'admin/layouts/main',
      title: 'Editar Usuario',
      currentPage: 'usuarios'
    });
  },
  async editar(req, res) {
    res.json({ message: 'Usuario actualizado' });
  },
  async eliminar(req, res) {
    res.json({ message: 'Usuario eliminado' });
  }
};

module.exports = usuarioController;
