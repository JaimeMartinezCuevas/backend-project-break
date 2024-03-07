const Product = require('../models/Product');
const url = require('url');

// Función para mostrar todos los productos
const showProducts = async (req, res) => {
  try {
    // Obtener la URL completa, incluidos los parámetros de consulta
    const fullUrl = req.originalUrl;
    console.log('URL completa:', fullUrl);

    // Analizar la URL para obtener los parámetros de consulta
    const parsedUrl = new URL(fullUrl, 'http://localhost:3000');
    const queryParams = parsedUrl.searchParams;
    console.log('Parámetros de consulta:', queryParams.toString());

    // Extraer el parámetro "category" de los parámetros de consulta
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


// Función para mostrar el detalle de un producto por su ID
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

// Función para mostrar el formulario de creación de un nuevo producto
const showNewProductForm = (req, res) => {
  res.render('newProduct');
};

// Función para crear un nuevo producto
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

// Función para manejar la creación de un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;

    // Crear un nuevo producto con los datos del formulario
    const newProduct = new Product({
      name,
      description,
      image,
      category,
      size,
      price
    });

    // Guardar el producto en la base de datos
    await newProduct.save();

    // Redireccionar a alguna página, como el dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Función para mostrar el formulario de edición de un producto por su ID
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

// Función para actualizar un producto por su ID
const updateProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;
    await Product.findByIdAndUpdate(req.params.productId, { name, description, image, category, size, price });
    res.redirect('/dashboard/' + req.params.productId);
  } catch (error) {
    res.status(500).send('Error al actualizar el producto');
  }
};

// Función para eliminar un producto por su ID
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(productId);
    // Redireccionar a la página de productos o al dashboard
    res.redirect('/products'); // O '/dashboard' según sea necesario
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Función para mostrar el detalle de un producto en el dashboard
const showProductInDashboard = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetailInDashboard', { product }); // Renderiza la vista del detalle del producto en el dashboard
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
