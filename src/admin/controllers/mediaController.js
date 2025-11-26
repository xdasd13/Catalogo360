const ImagenService = require("../services/imagenService");
const upload = require("../../config/multer");

const mediaController = {
  /**
   * Sube múltiples imágenes para un producto
   * Espera: files[] en el request
   * Body: { producto_id, alt_text (opcional) }
   */
  async subirMultiple(req, res) {
    try {
      const { producto_id, alt_text } = req.body;

      if (!producto_id) {
        return res.status(400).json({
          success: false,
          error: "El ID del producto es requerido",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No se recibieron archivos",
        });
      }

      const imagenesGuardadas = [];

      // Obtener el siguiente orden
      const imagenesExistentes = await ImagenService.getByProductoId(
        producto_id
      );
      let ordenActual = imagenesExistentes.length;

      // Procesar cada archivo
      for (const file of req.files) {
        try {
          // Procesar imagen con Sharp (resize, compresión)
          const imageUrls = await ImagenService.processAndSave(
            file.buffer,
            file.originalname,
            producto_id
          );

          // Guardar en BD
          const esPrincipal =
            imagenesExistentes.length === 0 && ordenActual === 0;

          const imagenGuardada = await ImagenService.create(
            producto_id,
            imageUrls.url,
            alt_text || `Imagen de producto ${producto_id}`,
            ordenActual,
            esPrincipal
          );

          imagenesGuardadas.push({
            ...imagenGuardada,
            thumbnail: imageUrls.thumbnail,
            medium: imageUrls.medium,
            large: imageUrls.large,
          });

          ordenActual++;
        } catch (error) {
          console.error("Error procesando archivo:", file.originalname, error);
        }
      }

      res.json({
        success: true,
        message: `${imagenesGuardadas.length} imagen(es) subida(s) correctamente`,
        imagenes: imagenesGuardadas,
      });
    } catch (error) {
      console.error("Error en subirMultiple:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Obtiene todas las imágenes de un producto
   * Params: producto_id
   */
  async obtenerPorProducto(req, res) {
    try {
      const { producto_id } = req.params;

      if (!producto_id) {
        return res.status(400).json({
          success: false,
          error: "El ID del producto es requerido",
        });
      }

      const imagenes = await ImagenService.getByProductoId(producto_id);

      res.json({
        success: true,
        imagenes,
      });
    } catch (error) {
      console.error("Error en obtenerPorProducto:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Actualiza el orden de las imágenes
   * Body: { imagenes: [{id, orden}] }
   */
  async actualizarOrden(req, res) {
    try {
      const { imagenes } = req.body;

      if (!imagenes || !Array.isArray(imagenes)) {
        return res.status(400).json({
          success: false,
          error: "Formato de datos inválido",
        });
      }

      await ImagenService.updateOrden(imagenes);

      res.json({
        success: true,
        message: "Orden actualizado correctamente",
      });
    } catch (error) {
      console.error("Error en actualizarOrden:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Establece una imagen como principal
   * Body: { imagen_id, producto_id }
   */
  async setPrincipal(req, res) {
    try {
      const { imagen_id, producto_id } = req.body;

      if (!imagen_id || !producto_id) {
        return res.status(400).json({
          success: false,
          error: "imagen_id y producto_id son requeridos",
        });
      }

      await ImagenService.setPrincipal(imagen_id, producto_id);

      res.json({
        success: true,
        message: "Imagen principal actualizada",
      });
    } catch (error) {
      console.error("Error en setPrincipal:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Elimina una imagen
   * Params: id
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "El ID de la imagen es requerido",
        });
      }

      await ImagenService.delete(id);

      res.json({
        success: true,
        message: "Imagen eliminada correctamente",
      });
    } catch (error) {
      console.error("Error en eliminar:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Vista de galería (página HTML)
   */
  async listar(req, res) {
    res.render("admin/pages/media/lista", {
      layout: "admin/layouts/main",
      title: "Galería de Imágenes",
      currentPage: "media",
    });
  },
};

module.exports = mediaController;
