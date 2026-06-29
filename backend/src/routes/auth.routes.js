const { Router } = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  ],
  validate,
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
  ],
  validate,
  AuthController.login
);

router.get('/me', protect, AuthController.getMe);

module.exports = router;
