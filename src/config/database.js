const mysql = require('mysql2/promise');
const { dbConfig } = require('./env');

const pool = mysql.createPool(dbConfig);

pool.on('connection', () => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.info('[DB] Nueva conexión al pool establecida');
  }
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[DB] Error en el pool de conexiones', err);
});

module.exports = pool;
