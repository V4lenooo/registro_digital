const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const AuthService = {
  async hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  async comparePasswords(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },

  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  },
};

module.exports = AuthService;
