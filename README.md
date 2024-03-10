# Tienda de ropa

En este ReadMe se resumirá el proceso de desarrollo del proyecto y los recursos empleados, acompañado de las explicaciones pertinentes en cada caso.


## Índice

1. Estructura de archivos
2. Detalles de los archivos
3. Tecnologías empleadas
4. Creación y conexión con la base de datos
5. Creación del modelo de producto
6. Creación de las rutas
7. Creación de controladores
8. Creación del ``index.js``
9. Creación de plantillas EJS
10. Creación del CSS
11. Creación de los tests
12. Despliegue
13. Navegación


## Estructura de archivos

```
.
├── public
│   ├── styles.css
│   └── img
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   └── productController.js
│   │
│   ├── models
│   │   └── Product.js
│   │
│   ├── routes
│   │   └── productRoutes.js
│   │
│   ├── views
│   │   ├── editProduct.ejs
│   │   ├── productDetail.ejs
│   │   ├── productDetailInDashboard.ejs
│   │   └── product.ejs
│   │
│   └── index.js
│
├── test
│   └── productController.test.js
│
├── .env
└── package.json

```

## Detalles de los archivos

- `public/styles.css`: Estilos CSS de todo el proyecto.
- `src/config/db.js`: Configuración para crear la conexión con la base de datos de MongoDB.
- `src/controllers/productController.js`: Archivo donde se definen y se exportan las operaciones del CRUD de la tienda.
- `src/models/Product.js`: La estructura del producto per se. Contiene los datos comunes para todos; ID, precio, talla, etc.
- `src/controllers/productController.js`: Archivo donde se definen y se exportan las operaciones del CRUD de la tienda.
- `src/views/editProduct.ejs`: Plantilla que contiene la estructura del formulario para la edición de los productos.
- `src/views/productDetail.ejs`: Plantilla que contiene la estructura de los detalles del producto base.
- `src/views/productDetailInDashboard.ejs`: Plantilla que contiene la estructura de los detalles del producto en el dashboard.
- `src/views/products.ejs`: Plantilla que contiene la estructura de la lista completa de productos.

## Tecnologías empleadas

- **Express.js**: Se utiliza como la base para la construcción de la aplicación; definir rutas, middlewares, iniciar el servidor, etc.

- **Mongoose**: Se utiliza para conectar la aplicación a la base de datos MongoDB.

- **Dotenv**: Se utiliza para cargar las variables de entorno del archivo .env.

- **Method override**: Middleware para soportar métodos CRUD en formularios HTML y poder manejar el contenido de sus campos.

- **Path**: Módulo para manejar y construir una ruta estática para los estilos CSS.

- **EJS**: Motor de plantillas que permite incrustar javaScript en documentos HTML (Es por eso que los archivos de la carpeta views tienen la terminación ".ejs"). Configurado como motor de vistas y utilizado para renderizar las páginas HTML.

- **MongoDB**: Aplicado en conjunto con Mongoose. La conexión  se realiza mediante la URL contretada en el archivo .env y definida como la URI de la base de datos.

- **CSS**: Empleado para dar estilos a la página y gestionar la interacción (botones, flexbox, efectos hover, etc.)

- **HTML**: Empleado para crear la estructura general a través de literl templates y para los formularios de edición y eliminación de productos.


## Creación de la estructura y conexión con la base de datos

Lo primero que hice fue acceder a mongodb.com para crear la base de datos. Me registré con mi cuenta de github y creé una base de prueba.
A continuación, comencé a crear las carpetas y archivos que se indicaban el el README del ejercicio para comenzar a trabajar en Visual Studio Code.

Una vez preparado, volví a MongoDB y copié el string de conexión. Después de guardarlo como MONGO_URI en el archivo .env, empleé moongose y dotenv para poder leer la dirección de la base de datos y poder acceder a ella.


## Creación del modelo de producto

En el archivo ``src/models/Product.js`` creeé un objeto con valores comunes para todos los productos ayudándome de mongoose; nombre, descripción imagen, categoría, tamaño y precio. Lo almacené en una variable y lo exporté.


## Creación de las rutas

Haciendo uso de express, dentro de ``src/routes/productRoutes.js``, definí y exporté la variable router para manejar las rutas indicadas en el README del ejercicio además de sus respectivos métodos CRUD.


## Creación de controladores

Al principio de ``src/controllers/productController.js`` requerimos el acceso al modelo del producto. Por otra parte, requerimos también el módilo "url" de node para facilitar el manejo de las URLs y poder realizar operaciones como el filtrado por categorías.

En este archivo se emplean diversas funciones de mongoose para gestionar las operaciones CRUD; a continuación explicaré la lógica de cada controlador;

- **showProducts**: Esta función imprime todos los productos. Si se proporciona una categoría, realiza una consulta a la base de datos para obtener dichos productos y renderiza la vista 'products' con la lista de productos.

- **showProductById**: Esta función muestra los detalles de un producto específico obteniendo el ID del producto de los parámetros de la solicitud. Como en el modelo de producto no se especifica un valor ID, se obtiene el generado por la base de datos.

- **showNewProductForm**: Estq función renderiza el formulario para crear un nuevo producto.

- **getNewProductForm**: Esta función devuelve un formulario HTML para la creación de un nuevo producto.

- **createProduct**: Esta función se utiliza para crear un nuevo producto. Extrae los datos del formulario de la solicitud y genera el nuevo producto después de ser guardado en la base de datos. Después de guardar el producto, redirige al usuario al dashboard.

- **showEditProductForm**: Esta función renderiza el formulario para editar un producto existente. Obtiene el ID de los parámetros de la solicitud y realiza una consulta para obtener la información del producto.

- **updateProduct**: Esta función se utiliza para actualizar la información de un producto existente extraendo los datos del formulario de edición y también lo actualiza la base de datos. Después redirige al usuario a la página de detalles del producto.

- **deleteProduct**: Esta función se utiliza para borrar un producto. Nuevamente obtiene el ID y elimina su información de la base de datos.

- showProductInDashboard: Esta función muestra los detalles de un producto específico en el panel de control. Similar a showProductById, pero renderiza la vista 'productDetailInDashboard' en lugar de 'productDetail'.


## Creación del ``index.js``

Con toda la lógica creada, definí mi archivo ``index.js`` como mi principal. Es en este donde se importan los módulos, se inicia el servidor, se configuran los middlewares, etc. En este index también se encuentran las literal templates de la raiz principal y del dashboard.
Tras realizar todas las conexiones necesarias, hice una serie de pruebas hasta que todo funcionó correctamente.


## Creación de plantillas EJS

Para mostrar los productos en pantalla, me ayudé del motor EJS, ya que la posibilidad de incrustar y llamar a fragmentos de código javascript dentro de una estructura HTML me resultó muy cómodo e intuitivo. Los archivos dentro de la carpeta ``views`` están realizados de esta forma y tienen la extensión .ejs.


## Creación del CSS

En las estructuras HTML de los archivos .ejs mencionados ateriormente pude añadir directamente el enlace al archivo CSS. Tras ver que no se vinculaba correctamente, me apoyé en el método path de node para poder crear rutas relativas, solucionando así el problema.
Trabajando con las clases de las etiquetas HTML de los .ejs fui aplicando estilos y efectos para crear una mínima interactividad para el usuario, además de implementar características flexbox para crear un diseño mínimamente responsive.

Hubiera querido añadir mediaqueries para mejorar el formato en pantallas pequeñas, pero había estado teniendo problemas con el despliegue, por lo que decidí ceñirme al flexbox.


## Creación de los tests

Para crear los tests de los controladores, empleé jest para "burlar" el código y simularlo para poder testearlo y manejar los errores. Para ello es necesario requerir tanto el modelo de ``src/models/Product`` y los controladores de ``src/controllers/productController``.
Incluye tests para supuestos para todos los controladores.


## Despliegue

El proyecto está subido y ha sido desplegado exitosamente en fl0.com y en render.com. La razón de por qué he recurrido a dos plataformas ha sido por un error a la hora de desplegar con FL0. Al encontrarte el archivo ``index.js`` dentro de la carpeta ``src``, el hoster tenía problemas para localizarlo.

Tras contactar al equipo de FL0 y ver que no era capaz de desplegarlo, traté de buscar otra página, logrando hacerlo al fin en Render. Finalmente, un miembro de FL0 me indicó que el problema estaba en un archivo adicional que había añadido para indicar la localización del ``index.js``.
Tras elimiarlo y gestionar las variables de entorno dentro de mi deploy, pude desplegarlo con éxito.


## Navegación

La tienda tiene un nav que muestra las rutas a las que se puede acceder, facilitando la navegación. Sin embargo, para acceder al dashboard en necesario añadirlo a mano en la URL.
Una vez dentro, se mostrará la página de inicio con la diferencia de que, al inspeccionar los productos, estos incuirán más datos, como el ID o la posibilidad de editarlos o eliminarlos. Tmabién se añade en enlace al formulario de creación de producto.