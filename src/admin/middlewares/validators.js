const { body, validationResult } = require('express-validator');

// Validadores para Productos
const productoValidators = {
    create: [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('precio_base').isDecimal({ min: '0.01' }).withMessage('El precio debe ser un número válido mayor a 0'),
        body('slug').optional().trim(),
        body('sku').optional().trim(),
        body('descripcion_corta').optional().trim().isLength({ max: 255 }).withMessage('La descripción corta no puede exceder 255 caracteres'),
        body('descripcion_larga').optional().trim(),
        body('activo').optional().isBoolean().withMessage('Activo debe ser true o false'),
        body('destacado').optional().isBoolean().withMessage('Destacado debe ser true o false')
    ],
    
    update: [
        body('nombre').optional().trim().isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('precio_base').optional().isDecimal({ min: '0.01' }).withMessage('El precio debe ser un número válido mayor a 0'),
        body('slug').optional().trim(),
        body('descripcion_corta').optional().trim().isLength({ max: 255 }).withMessage('La descripción corta no puede exceder 255 caracteres')
    ]
};

// Validadores para Categorías
const categoriaValidators = {
    create: [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('slug').optional().trim(),
        body('descripcion').optional().trim(),
        body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un número entero positivo')
    ],
    
    update: [
        body('nombre').optional().trim().isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('slug').optional().trim(),
        body('descripcion').optional().trim(),
        body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un número entero positivo')
    ]
};

// Validadores para Marcas
const marcaValidators = {
    create: [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('slug').optional().trim(),
        body('descripcion').optional().trim()
    ],
    
    update: [
        body('nombre').optional().trim().isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),
        body('slug').optional().trim(),
        body('descripcion').optional().trim()
    ]
};

// Validadores para Etiquetas
const etiquetaValidators = {
    create: [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        body('slug').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido')
    ],
    
    update: [
        body('nombre').optional().trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        body('slug').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido')
    ]
};

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('back');
    }
    next();
};

module.exports = {
    productoValidators,
    categoriaValidators,
    marcaValidators,
    etiquetaValidators,
    handleValidationErrors
};
