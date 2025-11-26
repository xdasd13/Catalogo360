const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const adminAuthController = require('../controllers/adminAuthController');
const productoController = require('../controllers/productoController');
const categoriaController = require('../controllers/categoriaController');
const marcaController = require('../controllers/marcaController');
const etiquetaController = require('../controllers/etiquetaController');
const usuarioController = require('../controllers/usuarioController');
const stockController = require('../controllers/stockController');
const varianteController = require('../controllers/varianteController');
const mediaController = require('../controllers/mediaController');
const seoController = require('../controllers/seoController');
const configController = require('../controllers/configController');
const isAdmin = require('../middlewares/isAdmin');

// Auth Routes (sin protección)
router.get('/login', adminAuthController.loginPage);
router.post('/login', adminAuthController.login);

// Dashboard (protegido)
router.get('/', isAdmin, dashboardController.index);

// Productos
router.get('/productos', isAdmin, productoController.listar);
router.get('/productos/nuevo', isAdmin, productoController.crearForm);
router.post('/productos', isAdmin, productoController.crear);
router.get('/productos/:id/editar', isAdmin, productoController.editarForm);
router.put('/productos/:id', isAdmin, productoController.editar);
router.delete('/productos/:id', isAdmin, productoController.eliminar);

// Categorías
router.get('/categorias', isAdmin, categoriaController.listar);
router.get('/categorias/nuevo', isAdmin, categoriaController.crearForm);
router.post('/categorias', isAdmin, categoriaController.crear);
router.get('/categorias/:id/editar', isAdmin, categoriaController.editarForm);
router.put('/categorias/:id', isAdmin, categoriaController.editar);
router.delete('/categorias/:id', isAdmin, categoriaController.eliminar);

// Marcas
router.get('/marcas', isAdmin, marcaController.listar);
router.get('/marcas/nuevo', isAdmin, marcaController.crearForm);
router.post('/marcas', isAdmin, marcaController.crear);
router.get('/marcas/:id/editar', isAdmin, marcaController.editarForm);
router.put('/marcas/:id', isAdmin, marcaController.editar);
router.delete('/marcas/:id', isAdmin, marcaController.eliminar);

// Etiquetas
router.get('/etiquetas', isAdmin, etiquetaController.listar);
router.post('/etiquetas', isAdmin, etiquetaController.crear);
router.put('/etiquetas/:id', isAdmin, etiquetaController.editar);
router.delete('/etiquetas/:id', isAdmin, etiquetaController.eliminar);

// Usuarios
router.get('/usuarios', isAdmin, usuarioController.listar);
router.get('/usuarios/nuevo', isAdmin, usuarioController.crearForm);
router.post('/usuarios', isAdmin, usuarioController.crear);
router.get('/usuarios/:id/editar', isAdmin, usuarioController.editarForm);
router.put('/usuarios/:id', isAdmin, usuarioController.editar);
router.delete('/usuarios/:id', isAdmin, usuarioController.eliminar);

// Stock
router.get('/stock', isAdmin, stockController.listar);
router.put('/stock/:id', isAdmin, stockController.actualizar);

// Variantes
router.get('/variantes', isAdmin, varianteController.listar);
router.post('/variantes', isAdmin, varianteController.crear);
router.put('/variantes/:id', isAdmin, varianteController.editar);
router.delete('/variantes/:id', isAdmin, varianteController.eliminar);

// Media
router.get('/media', isAdmin, mediaController.listar);
router.post('/media/subir', isAdmin, mediaController.subir);
router.delete('/media/:id', isAdmin, mediaController.eliminar);

// SEO
router.get('/seo', isAdmin, seoController.listar);
router.get('/seo/:id/editar', isAdmin, seoController.editarForm);
router.put('/seo/:id', isAdmin, seoController.editar);

// Configuración
router.get('/config', isAdmin, configController.listar);
router.put('/config', isAdmin, configController.actualizar);

module.exports = router;
