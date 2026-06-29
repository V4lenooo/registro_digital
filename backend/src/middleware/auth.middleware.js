const jwt = require('jsonwebtoken');
const { AppError } = require('./error.middleware');

/**
 * Verifica que el request tenga un JWT válido en el header Authorization.
 * Si es válido, adjunta el payload decodificado en req.user.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No autorizado. Por favor iniciá sesión.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Tu sesión expiró. Iniciá sesión nuevamente.', 401));
    }
    return next(new AppError('Token inválido.', 401));
  }
};

/**
 * Middleware de autorización por rol.
 * Uso: authorize('admin') o authorize('admin', 'moderator')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('No tenés permisos para realizar esta acción.', 403));
  }
  next();
};

module.exports = { protect, authorize };
