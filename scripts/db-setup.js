const pool = require("../src/config/database");

async function setupDatabase() {
  console.log("🔄 Verificando esquema de base de datos...");

  try {
    // 1. Crear tabla roles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        descripcion VARCHAR(255),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla roles verificada");

    // 2. Crear tabla usuario_roles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario_roles (
        usuario_id INT,
        rol_id INT,
        asignado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (usuario_id, rol_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabla usuario_roles verificada");

    // 3. Agregar columna foto_perfil a usuarios si no existe
    try {
      await pool.query(`
        ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) DEFAULT NULL
      `);
      console.log("✅ Columna foto_perfil agregada");
    } catch (error) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("ℹ️ Columna foto_perfil ya existe");
      } else {
        console.error("⚠️ Error columna foto_perfil:", error.message);
      }
    }

    // 4. Insertar roles por defecto
    const roles = [
      ["admin", "Administrador con acceso total al sistema"],
      ["editor", "Editor con acceso a gestión de productos y contenido"],
      ["cliente", "Cliente registrado con acceso a compras y perfil"],
    ];

    for (const [nombre, descripcion] of roles) {
      await pool.query(
        "INSERT IGNORE INTO roles (nombre, descripcion) VALUES (?, ?)",
        [nombre, descripcion]
      );
    }
    console.log("✅ Roles por defecto insertados");

    // 5. Asignar rol admin al usuario actual (opcional, para asegurar acceso)
    // Esto asume que el usuario con ID 1 es el admin
    const [adminRole] = await pool.query(
      'SELECT id FROM roles WHERE nombre = "admin"'
    );
    if (adminRole.length > 0) {
      await pool.query(
        "INSERT IGNORE INTO usuario_roles (usuario_id, rol_id) VALUES (1, ?)",
        [adminRole[0].id]
      );
      console.log("✅ Rol admin asignado al usuario ID 1");
    }

    console.log("\n✨ Base de datos actualizada correctamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error actualizando base de datos:", error);
    process.exit(1);
  }
}

setupDatabase();
