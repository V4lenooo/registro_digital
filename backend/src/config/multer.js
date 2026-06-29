const multer = require('multer');
const path = require('path');
const { AppError } = require('../middleware/error.middleware');

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_PATH || path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .toLowerCase();
    const unique = `${Date.now()}-${safeName}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Solo se permiten archivos PDF, JPG, PNG o WEBP', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

module.exports = upload;
