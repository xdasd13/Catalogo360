// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorMiddleware;
