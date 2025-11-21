const app = require('./app');
const { appConfig } = require('./config/env');

// Puerto por defecto si no está definido
const PORT = appConfig.port || 3000;
const ENV = appConfig.env || 'development';

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} (${ENV})`);
});

// Manejo de errores al iniciar el servidor
server.on('error', (err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});


process.on('SIGINT', () => {
  console.log('Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Terminando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = server;
