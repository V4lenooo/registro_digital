const db = require('../config/db');

const ContentModel = {
  async create({ userId, title, description, category, url }) {
    const [result] = await db.query(
      `INSERT INTO content (user_id, title, description, category, url)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, description, category, url || null]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS created_by
       FROM content c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getAll({ category } = {}) {
    let query = `
      SELECT c.*, u.name AS created_by
      FROM content c
      JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) { query += ' AND c.category = ?'; params.push(category); }
    query += ' ORDER BY c.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  },

  async update(id, { title, description, category, url }) {
    await db.query(
      `UPDATE content SET title = ?, description = ?, category = ?, url = ?
       WHERE id = ?`,
      [title, description, category, url || null, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM content WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = ContentModel;
