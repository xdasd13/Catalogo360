const MarcaService = require("../services/marcaService");
const { generateSlug } = require("../utils/slugGenerator");

const marcaController = {
  async listar(req, res) {
    try {
      const marcas = await MarcaService.getAll({ activo: true });
      res.render("Admin/pages/marcas/index", {
        currentPage: "marcas",
        marcas,
        message: req.flash("message"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin");
    }
  },

  async crearForm(req, res) {
    res.render("Admin/pages/marcas/nuevo", {
      currentPage: "marcas",
      error: req.flash("error"),
    });
  },

  async crear(req, res) {
    try {
      const { nombre, descripcion } = req.body;
      const slug = req.body.slug || generateSlug(nombre);

      await MarcaService.create({
        nombre,
        slug,
        descripcion: descripcion || null,
      });

      req.flash("message", "Marca creada correctamente");
      res.redirect("/admin/marcas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/marcas/nuevo");
    }
  },

  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const marca = await MarcaService.getById(id);

      if (!marca) {
        req.flash("error", "Marca no encontrada");
        return res.redirect("/admin/marcas");
      }

      res.render("Admin/pages/marcas/editar", {
        currentPage: "marcas",
        marca,
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/marcas");
    }
  },

  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      const slug = req.body.slug || generateSlug(nombre);

      await MarcaService.update(id, {
        nombre,
        slug,
        descripcion: descripcion || null,
      });

      req.flash("message", "Marca actualizada correctamente");
      res.redirect("/admin/marcas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/admin/marcas/${id}/editar`);
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await MarcaService.delete(id);
      req.flash("message", "Marca eliminada correctamente");
      res.redirect("/admin/marcas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/marcas");
    }
  },
};

module.exports = marcaController;
