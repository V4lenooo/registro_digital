/**
 * Clase personalizada para errores operacionales de la app.
 * Usala así: throw new AppError('mensaje', 404)
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de manejo de errores.
 * Express lo reconoce por tener 4 parámetros (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Errores de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Ya existe un registro con esos datos.';
  }

  // Errores de Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'El archivo es demasiado grande. Máximo 10MB.';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('💥 ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };
