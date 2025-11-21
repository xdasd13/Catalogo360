const HttpError = require('../errors/http-error');

const notFoundMiddleware = (req, _res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = notFoundMiddleware;
