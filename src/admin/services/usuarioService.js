const pool = require("../../config/database");
const bcrypt = require("bcryptjs");

/**
 * Servicio para gestionar usuarios
 */
class UsuarioService {
  /**
   * Obtener todos los usuarios con filtros opcionales
   * @param {Object} filters - Filtros opcionales (activo, rol)
   * @returns {Array} - Lista de usuarios
   */
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          u.id,
          u.email,
          u.nombre,
          u.apellido,
          u.telefono,
          u.activo,
          u.email_verificado,
          u.fecha_verificacion,
          u.ultimo_acceso,
          u.foto_perfil,
          u.creado_en,
          u.actualizado_en,
          GROUP_CONCAT(r.nombre) as roles
        FROM usuarios u
        LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
        LEFT JOIN roles r ON ur.rol_id = r.id
      `;

      const conditions = [];
      const params = [];

      if (filters.activo !== undefined) {
        conditions.push("u.activo = ?");
        params.push(filters.activo);
      }

      if (filters.rol) {
        conditions.push("r.nombre = ?");
        params.push(filters.rol);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " GROUP BY u.id ORDER BY u.creado_en DESC";

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object} - Usuario encontrado
   */
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          u.id,
          u.email,
          u.nombre,
          u.apellido,
          u.telefono,
          u.activo,
          u.email_verificado,
          u.fecha_verificacion,
          u.ultimo_acceso,
          u.foto_perfil,
          u.creado_en,
          u.actualizado_en
        FROM usuarios u
        WHERE u.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object} - Usuario encontrado
   */
  static async getByEmail(email) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} - Usuario creado
   */
  static async create(userData) {
    try {
      const {
        email,
        password,
        nombre,
        apellido,
        telefono,
        activo = true,
      } = userData;

      // Verificar si el email ya existe
      const existingUser = await this.getByEmail(email);
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `INSERT INTO usuarios 
        (email, password_hash, nombre, apellido, telefono, activo) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          email,
          passwordHash,
          nombre,
          apellido || null,
          telefono || null,
          activo,
        ]
      );

      return {
        id: result.insertId,
        email,
        nombre,
        apellido,
        telefono,
        activo,
      };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Object} - Usuario actualizado
   */
  static async update(id, userData) {
    try {
      const { email, nombre, apellido, telefono, activo } = userData;

      // Verificar si el usuario existe
      await this.getById(id);

      // Si se está actualizando el email, verificar que no exista
      if (email) {
        const existingUser = await this.getByEmail(email);
        if (existingUser && existingUser.id !== id) {
          throw new Error("El email ya está en uso por otro usuario");
        }
      }

      const fields = [];
      const values = [];

      if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
      }
      if (nombre !== undefined) {
        fields.push("nombre = ?");
        values.push(nombre);
      }
      if (apellido !== undefined) {
        fields.push("apellido = ?");
        values.push(apellido);
      }
      if (telefono !== undefined) {
        fields.push("telefono = ?");
        values.push(telefono);
      }
      if (activo !== undefined) {
        fields.push("activo = ?");
        values.push(activo);
      }

      if (fields.length === 0) {
        throw new Error("No hay campos para actualizar");
      }

      values.push(id);

      await pool.query(
        `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Cambiar contraseña de un usuario
   * @param {number} id - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   */
  static async changePassword(id, newPassword) {
    try {
      // Verificar que el usuario existe
      await this.getById(id);

      // Hash de la nueva contraseña
      const passwordHash = await bcrypt.hash(newPassword, 10);

      await pool.query("UPDATE usuarios SET password_hash = ? WHERE id = ?", [
        passwordHash,
        id,
      ]);

      return { success: true, message: "Contraseña actualizada correctamente" };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Activar o desactivar usuario
   * @param {number} id - ID del usuario
   * @param {boolean} activo - Estado activo
   */
  static async toggleActive(id, activo) {
    try {
      await pool.query("UPDATE usuarios SET activo = ? WHERE id = ?", [
        activo,
        id,
      ]);

      return { success: true, activo };
    } catch (error) {
      throw new Error(`Error al cambiar estado: ${error.message}`);
    }
  }

  /**
   * Eliminar usuario (soft delete - lo desactiva)
   * @param {number} id - ID del usuario
   */
  static async delete(id) {
    try {
      // No eliminamos físicamente, solo desactivamos
      await this.toggleActive(id, false);
      return { success: true, message: "Usuario desactivado correctamente" };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Obtener roles de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Array} - Lista de roles
   */
  static async getUserRoles(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT r.id, r.nombre, r.descripcion
         FROM roles r
         INNER JOIN usuario_roles ur ON r.id = ur.rol_id
         WHERE ur.usuario_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  /**
   * Asignar roles a un usuario
   * @param {number} userId - ID del usuario
   * @param {Array} roleIds - IDs de los roles
   */
  static async assignRoles(userId, roleIds) {
    try {
      // Primero, eliminar roles actuales
      await pool.query("DELETE FROM usuario_roles WHERE usuario_id = ?", [
        userId,
      ]);

      // Luego, asignar nuevos roles
      if (roleIds && roleIds.length > 0) {
        const values = roleIds.map((roleId) => [userId, roleId]);
        await pool.query(
          "INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ?",
          [values]
        );
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error al asignar roles: ${error.message}`);
    }
  }

  /**
   * Obtener todos los roles disponibles
   * @returns {Array} - Lista de roles
   */
  static async getAllRoles() {
    try {
      const [rows] = await pool.query("SELECT * FROM roles ORDER BY nombre");
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario tiene un rol específico
   * @param {number} userId - ID del usuario
   * @param {string} roleName - Nombre del rol
   * @returns {boolean} - True si tiene el rol
   */
  static async hasRole(userId, roleName) {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count
         FROM usuario_roles ur
         INNER JOIN roles r ON ur.rol_id = r.id
         WHERE ur.usuario_id = ? AND r.nombre = ?`,
        [userId, roleName]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw new Error(`Error al verificar rol: ${error.message}`);
    }
  }
}

module.exports = UsuarioService;
