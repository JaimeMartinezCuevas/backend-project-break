const Product = require('../models/Product');
const url = require('url');

//Imprimir todos los productos
const showProducts = async (req, res) => {
  try {
    //URL completa
    const fullUrl = req.originalUrl;
    console.log('URL completa:', fullUrl);

    //Parámetros de consulta
    const parsedUrl = new URL(fullUrl, 'http://localhost:3000');
    const queryParams = parsedUrl.searchParams;
    console.log('Parámetros de consulta:', queryParams.toString());

    //Extraer tipo de ropa
    const category = queryParams.get('category');
    console.log('Categoría:', category);

    if (category) {
      const products = await Product.find({ 'category': category });
      res.render('products', { products });
    } else {
      const products = await Product.find();
      res.render('products', { products });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
};


//Función detalle de producto
const showProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetail', { product });
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
};

//Imprimir formulario de creación
const showNewProductForm = (req, res) => {
  res.render('newProduct');
};

//Template creación dw producto
const getNewProductForm = (req, res) => {
  res.send(`

  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear nuevo producto</title>

    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="stylesheet" href="/styles.css">

  </head>

  <body class="body-details">

  <nav>
    <ul class="navegador">
      <li><a href="/dashboard">Inicio</a></li>
      <li><a href="/products">Productos</a></li>
        
      <li><a href="/products?category=Camisetas">Camisetas</a></li>
      <li><a href="/products?category=Pantalones">Pantalones</a></li>
      <li><a href="/products?category=Zapatos">Zapatos</a></li>
      <li><a href="/products?category=Accesorios">Accesorios</a></li>

      <li><a href="/login">Login</a></li>
    </ul>
  </nav>
  
    <h1>Creación de un nuevo producto</h1>

    <form action="/dashboard/new" method="POST">

      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" autocomplete="on" required>
      </div>
  
      <div class="form-group">
        <label for="description">Descripción:</label>
        <input type="text" id="description" name="description" autocomplete="on" required>
      </div>

      <div class="form-group">
        <label for="price">Precio:</label>
        <input type="number" id="price" name="price" autocomplete="on" required>
      </div>
    
      <div class="form-group">
        <label for="image">Imagen (URL):</label>
        <input type="text" id="image" name="image" autocomplete="on" required>
      </div>
  
      <div class="form-group">
        <label for="category">Categoría:</label>
        <select id="category" name="category" autocomplete="on" required>
          <option value="Camisetas">Camisetas</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Zapatos">Zapatos</option>
          <option value="Accesorios">Accesorios</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="size">Talla:</label>
        <select id="size" name="size" autocomplete="on" required>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>
  
      <button class="submit" type="submit">Crear Producto</button>
      
    </form>
  
  </body>
  </html>
  
  `);
};

//Crear producto nuevo
const createProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;

    //Usar datos del formulario
    const newProduct = new Product({
      name,
      description,
      image,
      category,
      size,
      price
    });

    //Guardarlo en la base de datos
    await newProduct.save();

    //Redireccionar al dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
};

//Imprimir formulario para edicitar
const showEditProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('editProduct', { product });
  } catch (error) {
    res.status(500).send('Error al obtener el producto para editar');
  }
};

//Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;
    await Product.findByIdAndUpdate(req.params.productId, { name, description, image, category, size, price });
    res.redirect('/dashboard/' + req.params.productId);
  } catch (error) {
    res.status(500).send('Error al actualizar el producto');
  }
};

//Borrar producti
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    //Borrar de la base de datos
    await Product.findByIdAndDelete(productId);

    //Redireccionar a la lista
    res.redirect('/products');

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
};

//Detalles en el dashboard
const showProductInDashboard = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetailInDashboard', { product });
  } catch (error) {
    res.status(500).send('Error al obtener el producto para mostrar en el dashboard');
  }
};



module.exports = {
  showProducts,
  showProductById,
  showNewProductForm,
  getNewProductForm,
  createProduct,
  showEditProductForm,
  updateProduct,
  deleteProduct,
  showProductInDashboard
};
