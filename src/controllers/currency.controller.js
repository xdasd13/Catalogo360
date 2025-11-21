const HttpError = require('../errors/http-error');
const { appConfig } = require('../config/env');

const fetch = async (...args) => {
  const { default: nodeFetch } = await import('node-fetch');
  return nodeFetch(...args);
};

const currencyController = {
  async getLatest(req, res) {
    const { currencies } = req.query;

    if (!currencies) {
      return res.status(400).json({ message: 'El parámetro "currencies" es requerido.' });
    }

    if (!appConfig.currencyApiKey) {
      throw new HttpError(503, 'Currency API key no configurada');
    }

    const url = new URL('https://api.currencyapi.com/v3/latest');
    url.searchParams.set('base_currency', 'PEN');
    url.searchParams.set('currencies', currencies);

    let response;
    try {
      response = await fetch(url.href, {
        headers: { apikey: appConfig.currencyApiKey },
      });
    } catch (error) {
      throw new HttpError(502, 'No se pudo conectar con Currency API');
    }

    if (!response.ok) {
      throw new HttpError(response.status, 'Error al consultar Currency API');
    }

    const data = await response.json();
    res.json(data);
  },
};

module.exports = currencyController;