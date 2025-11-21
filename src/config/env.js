const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error && process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.warn('No .env file found, relying on process environment variables');
}

const toNumber = (value, defaultValue) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const toBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
};

const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 3000),
  apiPrefix: process.env.API_PREFIX || '/api',
};

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: toNumber(process.env.DB_PORT, 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'catalogo',
  waitForConnections: toBoolean(process.env.DB_WAIT_FOR_CONNECTIONS, true),
  connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  queueLimit: toNumber(process.env.DB_QUEUE_LIMIT, 0),
  decimalNumbers: true,
  namedPlaceholders: true,
};

module.exports = {
  appConfig,
  dbConfig,
};
