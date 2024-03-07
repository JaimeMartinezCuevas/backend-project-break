const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//Ruta de productos
router.get('/products', productController.showProducts);
  
//Ruta detalles id
router.get('/products/:productId', productController.showProductById);

//Ruta formulario nuevo producto
router.get('/dashboard/new', productController.getNewProductForm);

//Ruta crear producto nuevo
router.post('/dashboard/new', productController.createProduct);
router.post('/dashboard', productController.createProduct);

//Rutaformulario editar producto
router.get('/dashboard/:productId/edit', productController.showEditProductForm);

//Rutaformulario editar producto
router.post('/dashboard/:productId', productController.updateProduct);

//Ruta detalles id dashboard
router.get('/dashboard/:productId', productController.showProductInDashboard);

//Ruta borrar producto
router.delete('/dashboard/:productId/delete', productController.deleteProduct);

module.exports = router;
