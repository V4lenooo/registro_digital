const { Router } = require('express');
const { body } = require('express-validator');
const DocumentController = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const upload = require('../config/multer');

const router = Router();

const docValidation = [
  body('title').trim().notEmpty().withMessage('El título es obligatorio.'),
  body('subject').trim().notEmpty().withMessage('La materia es obligatoria.'),
  body('type')
    .isIn(['parcial', 'guia', 'apunte', 'otro'])
    .withMessage('Tipo inválido. Usá: parcial, guia, apunte u otro.'),
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('El año debe ser válido.'),
];

// Rutas públicas (cualquiera puede ver)
router.get('/', DocumentController.getAll);
router.get('/:id', DocumentController.getOne);

// Rutas protegidas (requieren login)
router.use(protect);
router.get('/user/my', DocumentController.getMine);
router.post('/', upload.single('file'), docValidation, validate, DocumentController.upload);
router.delete('/:id', DocumentController.delete);

module.exports = router;
