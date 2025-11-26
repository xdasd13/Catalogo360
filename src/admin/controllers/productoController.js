const ProductoService = require("../services/productoService");
const CategoriaService = require("../services/categoriaService");
const MarcaService = require("../services/marcaService");
const EtiquetaService = require("../services/etiquetaService");
const { generateSlug } = require("../utils/slugGenerator");

const productoController = {
  // Listar productos
  async listar(req, res) {
    try {
      const productos = await ProductoService.getAll({ activo: true });
      res.render("Admin/pages/productos/index", {
        currentPage: "productos",
        productos,
        message: req.flash("message"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin");
    }
  },

  // Formulario crear
  async crearForm(req, res) {
    try {
      const marcas = await MarcaService.getAll({ activo: true });
      const categorias = await CategoriaService.getAll({ activo: true });
      const etiquetas = await EtiquetaService.getAll();

      res.render("Admin/pages/productos/nuevo", {
        currentPage: "productos",
        marcas,
        categorias,
        etiquetas,
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/productos");
    }
  },

  // Crear producto
  async crear(req, res) {
    try {
      const {
        nombre,
        precio_base,
        marca_id,
        descripcion_corta,
        descripcion_larga,
        sku,
        activo,
        destacado,
        categorias,
        etiquetas,
      } = req.body;

      const slug = req.body.slug || generateSlug(nombre);

      const nuevoProducto = await ProductoService.create({
        nombre,
        slug,
        precio_base: parseFloat(precio_base),
        marca_id: marca_id || null,
        descripcion_corta: descripcion_corta || null,
        descripcion_larga: descripcion_larga || null,
        sku: sku || null,
        activo: activo === "on" || activo === true,
        destacado: destacado === "on" || destacado === true,
      });

      if (categorias && categorias.length > 0) {
        await ProductoService.assignCategories(
          nuevoProducto.id,
          Array.isArray(categorias) ? categorias : [categorias]
        );
      }

      if (etiquetas && etiquetas.length > 0) {
        await ProductoService.assignTags(
          nuevoProducto.id,
          Array.isArray(etiquetas) ? etiquetas : [etiquetas]
        );
      }

      req.flash("message", "Producto creado correctamente");
      res.redirect("/admin/productos");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/productos/nuevo");
    }
  },

  // Formulario editar
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const producto = await ProductoService.getById(id);

      if (!producto) {
        req.flash("error", "Producto no encontrado");
        return res.redirect("/admin/productos");
      }

      const marcas = await MarcaService.getAll({ activo: true });
      const categorias = await CategoriaService.getAll({ activo: true });
      const etiquetas = await EtiquetaService.getAll();
      const productoCategorias = await ProductoService.getCategories(id);
      const productoEtiquetas = await ProductoService.getTags(id);

      res.render("Admin/pages/productos/editar", {
        currentPage: "productos",
        producto,
        marcas,
        categorias,
        etiquetas,
        productoCategorias,
        productoEtiquetas,
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/productos");
    }
  },

  // Editar producto
  async editar(req, res) {
    try {
      const { id } = req.params;
      const {
        nombre,
        precio_base,
        marca_id,
        descripcion_corta,
        descripcion_larga,
        sku,
        activo,
        destacado,
        categorias,
        etiquetas,
      } = req.body;

      const slug = req.body.slug || generateSlug(nombre);

      await ProductoService.update(id, {
        nombre,
        slug,
        precio_base: parseFloat(precio_base),
        marca_id: marca_id || null,
        descripcion_corta: descripcion_corta || null,
        descripcion_larga: descripcion_larga || null,
        sku: sku || null,
        activo: activo === "on" || activo === true,
        destacado: destacado === "on" || destacado === true,
      });

      if (categorias) {
        await ProductoService.assignCategories(
          id,
          Array.isArray(categorias) ? categorias : [categorias]
        );
      }

      if (etiquetas) {
        await ProductoService.assignTags(
          id,
          Array.isArray(etiquetas) ? etiquetas : [etiquetas]
        );
      }

      req.flash("message", "Producto actualizado correctamente");
      res.redirect("/admin/productos");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/admin/productos/${id}/editar`);
    }
  },

  // Eliminar producto
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await ProductoService.delete(id);
      req.flash("message", "Producto eliminado correctamente");
      res.redirect("/admin/productos");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/productos");
    }
  },
};

module.exports = productoController;
