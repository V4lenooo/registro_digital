const { validationResult } = require('express-validator');
const { AppError } = require('./error.middleware');

/**
 * Middleware que corre después de las reglas de express-validator.
 * Si hay errores de validación, responde 400 con todos los mensajes.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(' | ');
    return next(new AppError(messages, 400));
  }
  next();
};

module.exports = { validate };
