const ContentModel = require('../models/content.model');
const { AppError } = require('../middleware/error.middleware');

const ContentController = {
  // POST /api/content
  async create(req, res, next) {
    try {
      const { title, description, category, url } = req.body;
      const item = await ContentModel.create({
        userId: req.user.id,
        title,
        description,
        category,
        url,
      });
      res.status(201).json({ success: true, content: item });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/content
  async getAll(req, res, next) {
    try {
      const { category } = req.query;
      const items = await ContentModel.getAll({ category });
      res.json({ success: true, count: items.length, content: items });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/content/:id
  async getOne(req, res, next) {
    try {
      const item = await ContentModel.findById(req.params.id);
      if (!item) throw new AppError('Contenido no encontrado.', 404);
      res.json({ success: true, content: item });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/content/:id
  async update(req, res, next) {
    try {
      const item = await ContentModel.findById(req.params.id);
      if (!item) throw new AppError('Contenido no encontrado.', 404);

      if (item.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('No tenés permisos para editar este contenido.', 403);
      }

      const { title, description, category, url } = req.body;
      const updated = await ContentModel.update(req.params.id, { title, description, category, url });
      res.json({ success: true, content: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/content/:id
  async delete(req, res, next) {
    try {
      const item = await ContentModel.findById(req.params.id);
      if (!item) throw new AppError('Contenido no encontrado.', 404);

      if (item.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('No tenés permisos para borrar este contenido.', 403);
      }

      await ContentModel.delete(req.params.id);
      res.json({ success: true, message: 'Contenido eliminado.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ContentController;
