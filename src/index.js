const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db'); // Importar connectDB
const Product = require('./models/Product');
const path = require('path');

// Configuración de variables de entorno
dotenv.config({ path: './.env' });

// Inicialización de la aplicación Express
const app = express();


// Middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views'); // Directorio donde se encuentran tus vistas
app.use(methodOverride('_method'));


// Middleware para manejar el CSS
app.use(express.static(path.join(__dirname, '..', 'public')));


// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión a la base de datos establecida');
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
  process.exit(1);
});


// Configuración de las rutas
app.use('/', productRoutes);


// Middleware para la barra de menú
app.use((req, res, next) => {
  res.locals.categories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
  next();
});


//--MAIN--//

// Manejador para la ruta raíz
app.get('/', async (req, res) => {
  try {

    // Obtener todos los productos
    const products = await Product.find();

    // Generar la lista de productos en HTML
    const productsList = products.map(product => `
      <li>
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">

        <div class="details">
          <p>${product.price}€</p>
          <a href="/products/${product._id}">Ver detalles</a>
        </div>
        
      </li>
    `).join('');

    // Renderizar la página con la lista de productos
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tienda de ropa</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <link rel="stylesheet" href="/styles.css">

      </head>

        <body>

          <nav>
            <ul class="navegador">

              <li><a href="/">Inicio</a></li>
              <li><a href="/products">Productos</a></li>
              
              ${res.locals.categories.map(category => `<li><a href="/products?category=${encodeURIComponent(category)}">${category}</a></li>`).join('')}

              <li><a href="/login">Login</a></li>
            </ul>
          </nav>

          <div class="banner">
            <h1>MANN CO. STORE</h1>
            <br>
            <p>We sell products and get into fights</p>
          </div>

          <ul class="list">
            ${productsList}
          </ul>

        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


//--DASHBOARD--//

// Manejador para la ruta dashboard
app.get('/dashboard/', async (req, res) => {
  // Obtener todos los productos
  const products = await Product.find();

  // Generar la lista de productos en HTML
  const productsList = products.map(product => `
    <li>
      <h2>${product.name}</h2>
      <img src="${product.image}" alt="${product.name}">

      <div class="details">
        <p>${product.price}€</p>
        <a href="/dashboard/${product._id}">Ver detalles</a>
      </div>

    </li>
  `).join('');
  
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda de ropa (Dashboard)</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="stylesheet" href="/styles.css">

  </head>

    <body>

      <nav>
        <ul class="navegador">

          <li><a href="/dashboard">Inicio</a></li>
          <li><a href="/products">Productos</a></li>
            
          ${res.locals.categories.map(category => `<li><a href="/products?category=${encodeURIComponent(category)}">${category}</a></li>`).join('')}

          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      <div class="banner">
        <h1>MANN CO. STORE</h1>
        <br>
        <p>We sell products and get into fights*</p>
      </div>

      <ul class="list">
        ${productsList}
      </ul>
        
      </body>
    </html>
  `);
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
