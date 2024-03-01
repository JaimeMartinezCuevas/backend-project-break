const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para mostrar todos los productos
router.get('/products', productController.showProducts);
  
// Ruta para mostrar el detalle de un producto por su ID
router.get('/products/:productId', productController.showProductById);

// Ruta para mostrar el formulario para crear un nuevo producto
router.get('/dashboard/new', productController.getNewProductForm);

// Ruta para manejar la creación de un nuevo producto
router.post('/dashboard/new', productController.createProduct);

// Ruta para crear un nuevo producto
router.post('/dashboard', productController.createProduct);

// Ruta para mostrar el formulario de edición de un producto por su ID
router.get('/dashboard/:productId/edit', productController.showEditProductForm);

// Ruta para actualizar un producto por su ID
router.post('/dashboard/:productId', productController.updateProduct);

// Ruta para mostrar el detalle de un producto en el dashboard
router.get('/dashboard/:productId', productController.showProductInDashboard);

// Ruta para eliminar un producto por su ID
router.delete('/dashboard/:productId/delete', productController.deleteProduct);

module.exports = router;
