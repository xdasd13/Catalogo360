/**
 * Script para crear usuario admin inicial
 * Uso: node src/admin/utils/seedAdmin.js
 */

const bcrypt = require('bcryptjs');
const pool = require('../../config/database');

const seedAdmin = async () => {
    try {
        // Datos del admin
        const email = 'admin@catalogo360.com';
        const nombre = 'Administrador';
        const apellido = 'Sistema';
        const password = 'Admin@2024'; // Cambiar en producción

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar rol admin si no existe
        await pool.query(
            `INSERT IGNORE INTO roles (nombre, descripcion) 
             VALUES ('admin', 'Administrador del sistema')`
        );

        // Insertar usuario
        const [userResult] = await pool.query(
            `INSERT INTO usuarios (email, password_hash, nombre, apellido, email_verificado) 
             VALUES (?, ?, ?, ?, true)
             ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
            [email, hashedPassword, nombre, apellido]
        );

        const usuarioId = userResult.insertId;

        // Obtener ID del rol admin
        const [roleRows] = await pool.query(
            `SELECT id FROM roles WHERE nombre = 'admin'`
        );
        const rolId = roleRows[0].id;

        // Asignar rol admin al usuario
        await pool.query(
            `INSERT IGNORE INTO usuario_roles (usuario_id, rol_id) 
             VALUES (?, ?)`,
            [usuarioId, rolId]
        );

        console.log('✅ Usuario admin creado exitosamente');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Contraseña: ${password}`);
        console.log(`⚠️  IMPORTANTE: Cambia la contraseña después del primer login`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al crear usuario admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
