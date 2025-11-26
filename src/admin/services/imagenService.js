const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const pool = require("../../config/database");

/**
 * Servicio para gestionar imágenes de productos
 */
class ImagenService {
  /**
   * Procesa y guarda una imagen en múltiples tamaños
   * @param {Buffer} fileBuffer - Buffer del archivo
   * @param {string} originalName - Nombre original del archivo
   * @param {number} productoId - ID del producto
   * @returns {Object} - Rutas de las imágenes generadas
   */
  static async processAndSave(fileBuffer, originalName, productoId) {
    const timestamp = Date.now();
    const ext = path.extname(originalName).toLowerCase() || ".jpg";
    const baseName = `producto-${productoId}-${timestamp}`;

    const uploadsDir = path.join(__dirname, "../../../public/uploads/products");

    // Asegurar que el directorio existe
    await fs.mkdir(uploadsDir, { recursive: true });

    const sizes = {
      thumbnail: { width: 150, height: 150, suffix: "_thumb" },
      medium: { width: 500, height: 500, suffix: "_medium" },
      large: { width: 1200, height: 1200, suffix: "_large" },
    };

    const results = {};

    // Procesar cada tamaño
    for (const [sizeName, config] of Object.entries(sizes)) {
      const filename = `${baseName}${config.suffix}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      await sharp(fileBuffer)
        .resize(config.width, config.height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .png({ quality: 85 })
        .webp({ quality: 85 })
        .toFile(filepath);

      results[sizeName] = `/uploads/products/${filename}`;
    }

    // La URL principal será la versión large
    results.url = results.large;
    results.filename = `${baseName}${ext}`;

    return results;
  }

  /**
   * Guarda la información de la imagen en la base de datos
   * @param {number} productoId - ID del producto
   * @param {string} urlImagen - URL de la imagen
   * @param {string} altText - Texto alternativo
   * @param {number} orden - Orden de la imagen
   * @param {boolean} esPrincipal - Si es imagen principal
   * @returns {Object} - Imagen creada
   */
  static async create(
    productoId,
    urlImagen,
    altText = "",
    orden = 0,
    esPrincipal = false
  ) {
    try {
      // Si es principal, quitar la bandera de otras imágenes
      if (esPrincipal) {
        await pool.query(
          "UPDATE imagenes SET es_principal = FALSE WHERE producto_id = ?",
          [productoId]
        );
      }

      const [result] = await pool.query(
        `INSERT INTO imagenes (producto_id, url_imagen, alt_text, orden, es_principal)
         VALUES (?, ?, ?, ?, ?)`,
        [productoId, urlImagen, altText, orden, esPrincipal]
      );

      return {
        id: result.insertId,
        producto_id: productoId,
        url_imagen: urlImagen,
        alt_text: altText,
        orden,
        es_principal: esPrincipal,
      };
    } catch (error) {
      throw new Error(`Error al guardar imagen en BD: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las imágenes de un producto
   * @param {number} productoId - ID del producto
   * @returns {Array} - Array de imágenes
   */
  static async getByProductoId(productoId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM imagenes 
         WHERE producto_id = ? 
         ORDER BY es_principal DESC, orden ASC`,
        [productoId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener imágenes: ${error.message}`);
    }
  }

  /**
   * Actualiza el orden de las imágenes
   * @param {Array} imagenesOrden - Array de {id, orden}
   */
  static async updateOrden(imagenesOrden) {
    try {
      const promises = imagenesOrden.map(({ id, orden }) => {
        return pool.query("UPDATE imagenes SET orden = ? WHERE id = ?", [
          orden,
          id,
        ]);
      });
      await Promise.all(promises);
    } catch (error) {
      throw new Error(`Error al actualizar orden: ${error.message}`);
    }
  }

  /**
   * Marca una imagen como principal
   * @param {number} imagenId - ID de la imagen
   * @param {number} productoId - ID del producto
   */
  static async setPrincipal(imagenId, productoId) {
    try {
      // Quitar bandera de principal de todas las imágenes del producto
      await pool.query(
        "UPDATE imagenes SET es_principal = FALSE WHERE producto_id = ?",
        [productoId]
      );

      // Marcar la nueva como principal
      await pool.query("UPDATE imagenes SET es_principal = TRUE WHERE id = ?", [
        imagenId,
      ]);
    } catch (error) {
      throw new Error(`Error al establecer imagen principal: ${error.message}`);
    }
  }

  /**
   * Elimina una imagen del sistema y BD
   * @param {number} imagenId - ID de la imagen
   */
  static async delete(imagenId) {
    try {
      // Obtener información de la imagen
      const [rows] = await pool.query(
        "SELECT url_imagen FROM imagenes WHERE id = ?",
        [imagenId]
      );

      if (rows.length === 0) {
        throw new Error("Imagen no encontrada");
      }

      const urlImagen = rows[0].url_imagen;

      // Eliminar archivos físicos
      await this.deletePhysicalFiles(urlImagen);

      // Eliminar de BD
      await pool.query("DELETE FROM imagenes WHERE id = ?", [imagenId]);

      return { success: true };
    } catch (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }

  /**
   * Elimina los archivos físicos de una imagen
   * @param {string} urlImagen - URL de la imagen
   */
  static async deletePhysicalFiles(urlImagen) {
    try {
      const uploadsDir = path.join(
        __dirname,
        "../../../public/uploads/products"
      );

      // Extraer nombre base del archivo
      const filename = path.basename(urlImagen);
      const baseName = filename.replace(
        /_(thumb|medium|large)\.(jpg|jpeg|png|gif|webp)$/i,
        ""
      );
      const ext = path.extname(filename);

      // Eliminar todas las versiones
      const suffixes = ["_thumb", "_medium", "_large"];

      for (const suffix of suffixes) {
        const filepath = path.join(uploadsDir, `${baseName}${suffix}${ext}`);
        try {
          await fs.unlink(filepath);
        } catch (err) {
          // Ignorar errores si el archivo no existe
          console.log(`No se pudo eliminar ${filepath}:`, err.message);
        }
      }
    } catch (error) {
      console.error("Error al eliminar archivos físicos:", error);
    }
  }

  /**
   * Elimina todas las imágenes de un producto
   * @param {number} productoId - ID del producto
   */
  static async deleteByProductoId(productoId) {
    try {
      const imagenes = await this.getByProductoId(productoId);

      for (const imagen of imagenes) {
        await this.delete(imagen.id);
      }

      return { success: true };
    } catch (error) {
      throw new Error(
        `Error al eliminar imágenes del producto: ${error.message}`
      );
    }
  }
}

module.exports = ImagenService;
