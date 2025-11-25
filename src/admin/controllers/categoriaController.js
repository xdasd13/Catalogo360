const CategoriaService = require('../services/categoriaService');
const { generateSlug } = require('../utils/slugGenerator');

const categoriaController = {
  async listar(req, res) {
    try {
        const categorias = await CategoriaService.getAll({ activo: true });
        res.render('Admin/pages/categorias/lista', {
            currentPage: 'categorias',
            categorias,
            message: req.flash('message'),
            error: req.flash('error')
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/admin');
    }
  },

  async crearForm(req, res) {
    try {
        const categoriasPadre = await CategoriaService.getParents();
        res.render('Admin/pages/categorias/nuevo', {
            currentPage: 'categorias',
            categoriasPadre,
            error: req.flash('error')
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/admin/categorias');
    }
  },

  async crear(req, res) {
    try {
        const { nombre, descripcion, categoria_padre_id, orden } = req.body;
        const slug = req.body.slug || generateSlug(nombre);

        await CategoriaService.create({
            nombre,
            slug,
            descripcion: descripcion || null,
            categoria_padre_id: categoria_padre_id || null,
            orden: parseInt(orden) || 0
        });

        req.flash('message', 'Categoría creada correctamente');
        res.redirect('/admin/categorias');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/admin/categorias/nuevo');
    }
  },

  async editarForm(req, res) {
    try {
        const { id } = req.params;
        const categoria = await CategoriaService.getById(id);
        
        if (!categoria) {
            req.flash('error', 'Categoría no encontrada');
            return res.redirect('/admin/categorias');
        }

        const categoriasPadre = await CategoriaService.getParents();

        res.render('Admin/pages/categorias/editar', {
            currentPage: 'categorias',
            categoria,
            categoriasPadre,
            error: req.flash('error')
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/admin/categorias');
    }
  },

  async editar(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria_padre_id, orden } = req.body;
        const slug = req.body.slug || generateSlug(nombre);

        await CategoriaService.update(id, {
            nombre,
            slug,
            descripcion: descripcion || null,
            categoria_padre_id: categoria_padre_id || null,
            orden: parseInt(orden) || 0
        });

        req.flash('message', 'Categoría actualizada correctamente');
        res.redirect('/admin/categorias');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/admin/categorias/${id}/editar`);
    }
  },

  async eliminar(req, res) {
    try {
        const { id } = req.params;
        await CategoriaService.delete(id);
        req.flash('message', 'Categoría eliminada correctamente');
        res.redirect('/admin/categorias');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/admin/categorias');
    }
  }
};

module.exports = categoriaController;
