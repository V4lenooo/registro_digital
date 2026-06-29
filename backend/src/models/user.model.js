const db = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return { id: result.insertId, name, email, role: 'student' };
  },

  async getAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

module.exports = UserModel;
