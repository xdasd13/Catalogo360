const app = require('./app');
const { appConfig } = require('./config/env');

const server = app.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor corriendo en el puerto ${appConfig.port} (${appConfig.env})`);
});

module.exports = server;
