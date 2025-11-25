const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiados intentos, intenta más tarde',
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de login',
    skipSuccessfulRequests: true
});

module.exports = { adminLimiter, loginLimiter };
