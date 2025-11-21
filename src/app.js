const express = require('express');
const { appConfig } = require('./config/env');
const apiRoutes = require('./routes');
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const path = require('path');
const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: appConfig.env });
});

app.get('/', (_req, res) => {
  res.render('Home/index', { currencyApiKey: appConfig.currencyApiKey });
});

app.use(appConfig.apiPrefix, apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
