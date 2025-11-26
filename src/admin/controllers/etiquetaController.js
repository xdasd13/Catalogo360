const EtiquetaService = require("../services/etiquetaService");
const { generateSlug } = require("../utils/slugGenerator");

const etiquetaController = {
  async listar(req, res) {
    try {
      const etiquetas = await EtiquetaService.getAll();
      res.render("Admin/pages/etiquetas/index", {
        currentPage: "etiquetas",
        etiquetas,
        message: req.flash("message"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin");
    }
  },

  async crear(req, res) {
    try {
      const { nombre, descripcion, color } = req.body;
      const slug = req.body.slug || generateSlug(nombre);

      await EtiquetaService.create({
        nombre,
        slug,
        descripcion: descripcion || null,
        color: color || "#3b82f6",
      });

      req.flash("message", "Etiqueta creada correctamente");
      res.redirect("/admin/etiquetas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/etiquetas");
    }
  },

  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, color } = req.body;
      const slug = req.body.slug || generateSlug(nombre);

      await EtiquetaService.update(id, {
        nombre,
        slug,
        descripcion: descripcion || null,
        color: color || "#3b82f6",
      });

      req.flash("message", "Etiqueta actualizada correctamente");
      res.redirect("/admin/etiquetas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/etiquetas");
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await EtiquetaService.delete(id);
      req.flash("message", "Etiqueta eliminada correctamente");
      res.redirect("/admin/etiquetas");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/etiquetas");
    }
  },
};

module.exports = etiquetaController;
