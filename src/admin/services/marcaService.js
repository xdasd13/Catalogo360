const pool = require('../../config/database');

class MarcaService {
    // Obtener todas las marcas
    static async getAll(filters = {}) {
        try {
            let query = 'SELECT * FROM marcas WHERE 1=1';
            const params = [];

            if (filters.activo !== undefined) {
                query += ' AND activo = ?';
                params.push(filters.activo);
            }

            if (filters.search) {
                query += ' AND (nombre LIKE ? OR slug LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            query += ' ORDER BY nombre ASC';

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener marcas: ${error.message}`);
        }
    }

    // Obtener marca por ID
    static async getById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM marcas WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener marca: ${error.message}`);
        }
    }

    // Crear marca
    static async create(data) {
        try {
            const [result] = await pool.query(
                `INSERT INTO marcas (nombre, slug, logo_url, descripcion, activo)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    data.nombre,
                    data.slug,
                    data.logo_url || null,
                    data.descripcion || null,
                    data.activo !== undefined ? data.activo : true
                ]
            );
            return { id: result.insertId, ...data };
        } catch (error) {
            throw new Error(`Error al crear marca: ${error.message}`);
        }
    }

    // Actualizar marca
    static async update(id, data) {
        try {
            const updates = [];
            const values = [];

            Object.keys(data).forEach(key => {
                if (['nombre', 'slug', 'logo_url', 'descripcion', 'activo'].includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(data[key]);
                }
            });

            if (updates.length === 0) return { id, ...data };

            values.push(id);
            const query = `UPDATE marcas SET ${updates.join(', ')} WHERE id = ?`;

            await pool.query(query, values);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al actualizar marca: ${error.message}`);
        }
    }

    // Eliminar marca
    static async delete(id) {
        try {
            await pool.query('DELETE FROM marcas WHERE id = ?', [id]);
            return { success: true, id };
        } catch (error) {
            throw new Error(`Error al eliminar marca: ${error.message}`);
        }
    }

    // Verificar si el slug ya existe
    static async slugExists(slug, excludeId = null) {
        try {
            let query = 'SELECT id FROM marcas WHERE slug = ?';
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
}

module.exports = MarcaService;
