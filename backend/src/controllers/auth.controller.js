const UserModel = require('../models/user.model');
const AuthService = require('../services/auth.service');
const { AppError } = require('../middleware/error.middleware');

const AuthController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const existing = await UserModel.findByEmail(email);
      if (existing) throw new AppError('Ya existe una cuenta con ese email.', 409);

      const passwordHash = await AuthService.hashPassword(password);
      const user = await UserModel.create({ name, email, passwordHash });

      const token = AuthService.generateToken({ id: user.id, email, role: user.role });

      res.status(201).json({ success: true, token, user });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) throw new AppError('Email o contraseña incorrectos.', 401);

      const valid = await AuthService.comparePasswords(password, user.password_hash);
      if (!valid) throw new AppError('Email o contraseña incorrectos.', 401);

      const token = AuthService.generateToken({ id: user.id, email, role: user.role });

      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) throw new AppError('Usuario no encontrado.', 404);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
