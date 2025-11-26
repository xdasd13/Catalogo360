const pool = require('../../config/database');

class EtiquetaService {
    // Obtener todas las etiquetas
    static async getAll(filters = {}) {
        try {
            let query = 'SELECT * FROM etiquetas WHERE 1=1';
            const params = [];

            if (filters.search) {
                query += ' AND nombre LIKE ?';
                params.push(`%${filters.search}%`);
            }

            query += ' ORDER BY nombre ASC';

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener etiquetas: ${error.message}`);
        }
    }

    // Obtener etiqueta por ID
    static async getById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM etiquetas WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener etiqueta: ${error.message}`);
        }
    }

    // Crear etiqueta
    static async create(data) {
        try {
            const [result] = await pool.query(
                `INSERT INTO etiquetas (nombre, slug, descripcion, color)
                 VALUES (?, ?, ?, ?)`,
                [
                    data.nombre,
                    data.slug,
                    data.descripcion || null,
                    data.color || '#3b82f6'
                ]
            );
            return { id: result.insertId, ...data };
        } catch (error) {
            throw new Error(`Error al crear etiqueta: ${error.message}`);
        }
    }

    // Actualizar etiqueta
    static async update(id, data) {
        try {
            const updates = [];
            const values = [];

            Object.keys(data).forEach(key => {
                if (['nombre', 'slug', 'descripcion', 'color'].includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(data[key]);
                }
            });

            if (updates.length === 0) return { id, ...data };

            values.push(id);
            const query = `UPDATE etiquetas SET ${updates.join(', ')} WHERE id = ?`;

            await pool.query(query, values);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al actualizar etiqueta: ${error.message}`);
        }
    }

    // Eliminar etiqueta
    static async delete(id) {
        try {
            await pool.query('DELETE FROM etiquetas WHERE id = ?', [id]);
            return { success: true, id };
        } catch (error) {
            throw new Error(`Error al eliminar etiqueta: ${error.message}`);
        }
    }

    // Verificar si el slug ya existe
    static async slugExists(slug, excludeId = null) {
        try {
            let query = 'SELECT id FROM etiquetas WHERE slug = ?';
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

module.exports = EtiquetaService;
