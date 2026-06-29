const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const contentRoutes = require('./routes/content.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos públicamente (por su URL)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Manejo de errores (siempre al final) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
