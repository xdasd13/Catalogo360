const pool = require("../config/database");

class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  async create(userData) {
    const { email, password_hash, nombre, apellido, telefono } = userData;
    const [result] = await pool.query(
      "INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono) VALUES (?, ?, ?, ?, ?)",
      [email, password_hash, nombre, apellido, telefono]
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, email, nombre, apellido, rol FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}

module.exports = new UserRepository();
