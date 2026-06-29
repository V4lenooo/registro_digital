const path = require('path');
const fs = require('fs');
const DocumentModel = require('../models/document.model');
const { AppError } = require('../middleware/error.middleware');

const DocumentController = {
  // POST /api/documents
  async upload(req, res, next) {
    try {
      if (!req.file) throw new AppError('No se recibió ningún archivo.', 400);

      const { title, subject, type, year } = req.body;

      const doc = await DocumentModel.create({
        userId:   req.user.id,
        title,
        subject,
        type,
        year:     parseInt(year),
        filePath: req.file.filename,
        fileSize: req.file.size,
      });

      res.status(201).json({ success: true, document: doc });
    } catch (err) {
      // Si el modelo falló, borramos el archivo ya subido
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      next(err);
    }
  },

  // GET /api/documents
  async getAll(req, res, next) {
    try {
      const { subject, type, year, search } = req.query;
      const docs = await DocumentModel.getAll({ subject, type, year, search });

      // Adjuntar URL de descarga
      const base = `${req.protocol}://${req.get('host')}`;
      const documents = docs.map((d) => ({
        ...d,
        downloadUrl: `${base}/uploads/${d.file_path}`,
      }));

      res.json({ success: true, count: documents.length, documents });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/documents/my
  async getMine(req, res, next) {
    try {
      const docs = await DocumentModel.getByUser(req.user.id);
      const base = `${req.protocol}://${req.get('host')}`;
      const documents = docs.map((d) => ({
        ...d,
        downloadUrl: `${base}/uploads/${d.file_path}`,
      }));
      res.json({ success: true, count: documents.length, documents });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/documents/:id
  async getOne(req, res, next) {
    try {
      const doc = await DocumentModel.findById(req.params.id);
      if (!doc) throw new AppError('Documento no encontrado.', 404);

      const base = `${req.protocol}://${req.get('host')}`;
      res.json({
        success: true,
        document: { ...doc, downloadUrl: `${base}/uploads/${doc.file_path}` },
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/documents/:id
  async delete(req, res, next) {
    try {
      const doc = await DocumentModel.findById(req.params.id);
      if (!doc) throw new AppError('Documento no encontrado.', 404);

      // Solo el dueño o un admin pueden borrar
      if (doc.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('No tenés permisos para borrar este documento.', 403);
      }

      // Borrar archivo físico
      const filePath = path.join(__dirname, '../../uploads', doc.file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await DocumentModel.delete(req.params.id);
      res.json({ success: true, message: 'Documento eliminado.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = DocumentController;
