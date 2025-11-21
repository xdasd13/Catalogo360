const pool = require('../config/database');

const productRepository = {
  async findAll() {
    const [rows] = await pool.query('SELECT id, name, price, stock FROM products');
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  async create({ name, price, stock }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
      [name, price, stock]
    );
    return { id: result.insertId, name, price, stock };
  },
  async update(id, { name, price, stock }) {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
      [name, price, stock, id]
    );
    return { id, name, price, stock };
  },
  async remove(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },
};

module.exports = productRepository;
