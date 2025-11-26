const pool = require('../../config/database');

class ProductoService {
    // Obtener todos los productos
    static async getAll(filters = {}) {
        try {
            let query = 'SELECT p.*, m.nombre as marca_nombre FROM productos p LEFT JOIN marcas m ON p.marca_id = m.id WHERE 1=1';
            const params = [];

            if (filters.activo !== undefined) {
                query += ' AND p.activo = ?';
                params.push(filters.activo);
            }

            if (filters.search) {
                query += ' AND (p.nombre LIKE ? OR p.slug LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            if (filters.marca_id) {
                query += ' AND p.marca_id = ?';
                params.push(filters.marca_id);
            }

            query += ' ORDER BY p.creado_en DESC LIMIT 50';

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Obtener producto por ID
    static async getById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT p.*, m.nombre as marca_nombre FROM productos p LEFT JOIN marcas m ON p.marca_id = m.id WHERE p.id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    // Crear producto
    static async create(data) {
        try {
            const [result] = await pool.query(
                `INSERT INTO productos (marca_id, nombre, slug, sku, descripcion_corta, descripcion_larga, precio_base, precio_oferta, activo, destacado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.marca_id || null,
                    data.nombre,
                    data.slug,
                    data.sku || null,
                    data.descripcion_corta || null,
                    data.descripcion_larga || null,
                    data.precio_base,
                    data.precio_oferta || null,
                    data.activo !== undefined ? data.activo : true,
                    data.destacado !== undefined ? data.destacado : false
                ]
            );
            return { id: result.insertId, ...data };
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    // Actualizar producto
    static async update(id, data) {
        try {
            const updates = [];
            const values = [];

            Object.keys(data).forEach(key => {
                if (['nombre', 'slug', 'sku', 'descripcion_corta', 'descripcion_larga', 'precio_base', 'precio_oferta', 'activo', 'destacado', 'marca_id'].includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(data[key]);
                }
            });

            if (updates.length === 0) return { id, ...data };

            values.push(id);
            const query = `UPDATE productos SET ${updates.join(', ')}, actualizado_en = NOW() WHERE id = ?`;

            await pool.query(query, values);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    // Eliminar producto
    static async delete(id) {
        try {
            await pool.query('DELETE FROM productos WHERE id = ?', [id]);
            return { success: true, id };
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    // Obtener categorías del producto
    static async getCategories(productId) {
        try {
            const [rows] = await pool.query(
                `SELECT c.* FROM categorias c 
                 INNER JOIN producto_categorias pc ON c.id = pc.categoria_id 
                 WHERE pc.producto_id = ?`,
                [productId]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener categorías: ${error.message}`);
        }
    }

    // Asignar categorías al producto
    static async assignCategories(productId, categoryIds) {
        try {
            // Eliminar categorías anteriores
            await pool.query('DELETE FROM producto_categorias WHERE producto_id = ?', [productId]);

            // Insertar nuevas categorías
            if (categoryIds && categoryIds.length > 0) {
                const values = categoryIds.map(catId => [productId, catId]);
                await pool.query('INSERT INTO producto_categorias (producto_id, categoria_id) VALUES ?', [values]);
            }

            return { success: true, productId, categoryIds };
        } catch (error) {
            throw new Error(`Error al asignar categorías: ${error.message}`);
        }
    }

    // Obtener etiquetas del producto
    static async getTags(productId) {
        try {
            const [rows] = await pool.query(
                `SELECT e.* FROM etiquetas e 
                 INNER JOIN producto_etiquetas pe ON e.id = pe.etiqueta_id 
                 WHERE pe.producto_id = ?`,
                [productId]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener etiquetas: ${error.message}`);
        }
    }

    // Asignar etiquetas al producto
    static async assignTags(productId, tagIds) {
        try {
            await pool.query('DELETE FROM producto_etiquetas WHERE producto_id = ?', [productId]);

            if (tagIds && tagIds.length > 0) {
                const values = tagIds.map(tagId => [productId, tagId]);
                await pool.query('INSERT INTO producto_etiquetas (producto_id, etiqueta_id) VALUES ?', [values]);
            }

            return { success: true, productId, tagIds };
        } catch (error) {
            throw new Error(`Error al asignar etiquetas: ${error.message}`);
        }
    }
}

module.exports = ProductoService;
