const { Router } = require('express');
const { body } = require('express-validator');
const ContentController = require('../controllers/content.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = Router();

const CATEGORIES = ['link', 'horario', 'fecha_importante', 'aviso', 'otro'];

const contentValidation = [
  body('title').trim().notEmpty().withMessage('El título es obligatorio.'),
  body('description').trim().notEmpty().withMessage('La descripción es obligatoria.'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Categoría inválida. Opciones: ${CATEGORIES.join(', ')}.`),
  body('url').optional().isURL().withMessage('La URL no es válida.'),
];

// Rutas públicas
router.get('/', ContentController.getAll);
router.get('/:id', ContentController.getOne);

// Rutas protegidas
router.use(protect);
router.post('/', contentValidation, validate, ContentController.create);
router.put('/:id', contentValidation, validate, ContentController.update);
router.delete('/:id', ContentController.delete);

module.exports = router;
