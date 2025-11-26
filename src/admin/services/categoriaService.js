const pool = require('../../config/database');

class CategoriaService {
    // Obtener todas las categorías
    static async getAll(filters = {}) {
        try {
            let query = 'SELECT * FROM categorias WHERE 1=1';
            const params = [];

            if (filters.activo !== undefined) {
                query += ' AND activo = ?';
                params.push(filters.activo);
            }

            if (filters.search) {
                query += ' AND (nombre LIKE ? OR slug LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            query += ' ORDER BY orden ASC, creado_en DESC';

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener categorías: ${error.message}`);
        }
    }

    // Obtener categoría por ID
    static async getById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener categoría: ${error.message}`);
        }
    }

    // Crear categoría
    static async create(data) {
        try {
            const [result] = await pool.query(
                `INSERT INTO categorias (nombre, slug, descripcion, categoria_padre_id, imagen_url, orden, activo)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.nombre,
                    data.slug,
                    data.descripcion || null,
                    data.categoria_padre_id || null,
                    data.imagen_url || null,
                    data.orden || 0,
                    data.activo !== undefined ? data.activo : true
                ]
            );
            return { id: result.insertId, ...data };
        } catch (error) {
            throw new Error(`Error al crear categoría: ${error.message}`);
        }
    }

    // Actualizar categoría
    static async update(id, data) {
        try {
            const updates = [];
            const values = [];

            Object.keys(data).forEach(key => {
                if (['nombre', 'slug', 'descripcion', 'categoria_padre_id', 'imagen_url', 'orden', 'activo'].includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(data[key]);
                }
            });

            if (updates.length === 0) return { id, ...data };

            values.push(id);
            const query = `UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`;

            await pool.query(query, values);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al actualizar categoría: ${error.message}`);
        }
    }

    // Eliminar categoría
    static async delete(id) {
        try {
            await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
            return { success: true, id };
        } catch (error) {
            throw new Error(`Error al eliminar categoría: ${error.message}`);
        }
    }

    // Verificar si el slug ya existe
    static async slugExists(slug, excludeId = null) {
        try {
            let query = 'SELECT id FROM categorias WHERE slug = ?';
            const params = [slug];

            if (excludeId) {
                query += ' AND id != ?';
                params.push(excludeId);
            }

            const [rows] = await pool.query(query, params);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar slug: ${error.message}`);
        }
    }

    // Obtener categorías padre
    static async getParents() {
        try {
            const [rows] = await pool.query(
                'SELECT id, nombre FROM categorias WHERE categoria_padre_id IS NULL AND activo = true ORDER BY nombre'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener categorías padre: ${error.message}`);
        }
    }
}

module.exports = CategoriaService;
