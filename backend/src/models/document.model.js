const db = require('../config/db');

const DocumentModel = {
  async create({ userId, title, subject, type, year, filePath, fileSize }) {
    const [result] = await db.query(
      `INSERT INTO documents (user_id, title, subject, type, year, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, subject, type, year, filePath, fileSize]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT d.*, u.name AS uploaded_by
       FROM documents d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getAll({ subject, type, year, search } = {}) {
    let query = `
      SELECT d.*, u.name AS uploaded_by
      FROM documents d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (subject) { query += ' AND d.subject = ?'; params.push(subject); }
    if (type)    { query += ' AND d.type = ?';    params.push(type); }
    if (year)    { query += ' AND d.year = ?';    params.push(year); }
    if (search)  {
      query += ' AND (d.title LIKE ? OR d.subject LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY d.created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async getByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM documents WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = DocumentModel;
