const productController = require('../src/controllers/productController');
const Product = require('../src/models/Product');

jest.mock('../src/models/Product');

describe('Product Controller Tests', () => {

  // Mock data for testing
  const mockProduct = {
    _id: '123',
    name: 'Test Product',
    description: 'Test Description',
    image: 'test.jpg',
    category: 'Test Category',
    size: 'Test Size',
    price: 29.99,
  };
  

    describe('showProducts', () => {

        //Test for showProducts function
        test('should render products', async () => {

            //Mock product.find to return products
            Product.find.mockResolvedValueOnce([mockProduct]);
            
                const req = { originalUrl: 'http://localhost:3000/products' };
                const res = {
                    render: jest.fn(),
                    status: jest.fn(),
                };

                await productController.showProducts(req, res);

                //Assert that the render function was called with the correct parameters
                expect(res.render).toHaveBeenCalledWith('products', { products: [mockProduct] });
            });

        });


        //Test showProductById

        describe('showProductById', () => {

            test('should render product detail', async () => {

            Product.findById.mockResolvedValueOnce(mockProduct);
    
            const req = { params: { productId: '123' } };
            const res = {
                render: jest.fn(),
                status: jest.fn(),
            };
  
        await productController.showProductById(req, res);
  
        //Assert that the render function was called with the correct parameters
        expect(res.render).toHaveBeenCalledWith('productDetail', { product: mockProduct });
        });
  
            test('should return 404 if product not found', async () => {
                //Mock product.findById to return null (product not found)
                Product.findById.mockResolvedValueOnce(null);
        
                const req = { params: { productId: '123' } };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    send: jest.fn(),
                };
        
                await productController.showProductById(req, res);
        
                //Assert that the status and send functions were called with the correct parameters
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.send).toHaveBeenCalledWith('Producto no encontrado');
            });
    
        });

        describe('showNewProductForm', () => {
            test('should render the new product form', () => {
            const req = {};
            const res = {
                render: jest.fn(),
            };
    
            productController.showNewProductForm(req, res);
    
            //Assert that the render function was called with the correct parameters
            expect(res.render).toHaveBeenCalledWith('newProduct');
            });
        });
  
        describe('getNewProductForm', () => {
            test('should return HTML for new product form', () => {
            const req = {};
            const res = {
                send: jest.fn(),
            };
    
            productController.getNewProductForm(req, res);
    
            //Assert that the send function was called with the correct parameters
            expect(res.send).toHaveBeenCalled();
            //Add more assertions based on the expected HTML content
            });
        });
  

        //Test createProduct

        describe('createProduct', () => {
            test('should create a new product and redirect to dashboard', async () => {
            // Mock req.body with form data
            const req = {
                body: {
                name: 'Test Product',
                description: 'Test Description',
                image: 'test.jpg',
                category: 'Test Category',
                size: 'Test Size',
                price: 29.99,
                },
            };
        
            const res = {
                redirect: jest.fn(),
            };
        
            //Mock poduct constructor and save function
            jest.spyOn(Product.prototype, 'save').mockResolvedValueOnce();
        
            await productController.createProduct(req, res);
        
            //Assert that the poduct constructor was called with the correct parameters
            expect(Product).toHaveBeenCalledWith({
                name: 'Test Product',
                description: 'Test Description',
                image: 'test.jpg',
                category: 'Test Category',
                size: 'Test Size',
                price: 29.99,
            });
        
            //Assert that the save function was called
            expect(Product.prototype.save).toHaveBeenCalled();
        
            //Assert that the redirect function was called with the correct parameter
            expect(res.redirect).toHaveBeenCalledWith('/dashboard');
            });
        
            test('should handle errors and send internal server error', async () => {

            const req = {
                body: {
                //incomplete or invalid data
                },
            };
        
            const res = {
                redirect: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
        
            //Mock product constructor and save function to throw an error
            jest.spyOn(Product.prototype, 'save').mockRejectedValueOnce(new Error('Mock Error'));
        
            await productController.createProduct(req, res);
        
            //Assert that the status and send functions were called with the correct parameters
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error interno del servidor');
            });
        });


    //Test showEditProductForm

    describe('showEditProductForm', () => {
        test('should render edit product form when product is found', async () => {
        
        //Mock product.findById to return a product
        const mockProduct = {
            _id: '123',
            name: 'Test Product',
            description: 'Test Description',
            image: 'test.jpg',
            category: 'Test Category',
            size: 'Test Size',
            price: 29.99,
        };
        Product.findById.mockResolvedValueOnce(mockProduct);
    
        const req = { params: { productId: '123' } };
        const res = {
            render: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    
        await productController.showEditProductForm(req, res);
    
        //Assert that the render function was called with the correct parameters
        expect(res.render).toHaveBeenCalledWith('editProduct', { product: mockProduct });
        });
    
        test('should return 404 if product is not found', async () => {

        Product.findById.mockResolvedValueOnce(null);
    
        const req = { params: { productId: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    
        await productController.showEditProductForm(req, res);
    
        //Assert that the status and send functions were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Producto no encontrado');
        });
    
        test('should handle errors and send internal server error', async () => {

            Product.findById.mockRejectedValueOnce(new Error('Mock Error'));
        
            const req = { params: { productId: '123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
        
            await productController.showEditProductForm(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al obtener el producto para editar');
        });
    });


    //Test updateProduct

    describe('updateProduct', () => {
        test('should update a product and redirect to product detail page', async () => {

            const req = {
            params: { productId: '123' },
            body: {
              name: 'Updated Product',
              description: 'Updated Description',
              image: 'updated.jpg',
              category: 'Updated Category',
              size: 'Updated Size',
              price: 39.99,
            },
          };
      
          const res = {
            redirect: jest.fn(),
          };
      
          //mock product.findByIdAndUpdate to resolve successfully
          Product.findByIdAndUpdate.mockResolvedValueOnce();
      
          await productController.updateProduct(req, res);
      
          //assert that product.findByIdAndUpdate was called with the correct parameters
          expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
            '123',
            {
              name: 'Updated Product',
              description: 'Updated Description',
              image: 'updated.jpg',
              category: 'Updated Category',
              size: 'Updated Size',
              price: 39.99,
            }
          );
      
          //Assert that the redirect function was called with the correct parameter
          expect(res.redirect).toHaveBeenCalledWith('/dashboard/123');
        });
      
        test('should handle errors and send internal server error', async () => {

        //Mock req.body with updated product data
        const req = {
            params: { productId: '123' }
        };
      
        const res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
      
        //Mock product.findByIdAndUpdate to throw an error
        Product.findByIdAndUpdate.mockRejectedValueOnce(new Error('Mock Error'));
      
        await productController.updateProduct(req, res);
      
        //Assert that the status and send functions were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error al actualizar el producto');
        });
    });

    
    //Test deleteProduct

    describe('Product Controller Tests', () => {

        let req, res;
      
        beforeEach(() => {
          req = {};
          res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
          };
        });
            
        it('should delete a product and redirect to /products', async () => {

            req.params = { productId: 'mockProductId' };
        
            Product.findByIdAndDelete = jest.fn().mockResolvedValue({/*Lorem ipsum*/});
        
            //call the function
            await productController.deleteProduct(req, res);
        
            //Assertions
            expect(Product.findByIdAndDelete).toHaveBeenCalledWith('mockProductId');
            expect(res.redirect).toHaveBeenCalledWith('/products');
        });
    });


    //Test showProductInDashboard

    describe('Product Controller Tests', () => {

        let req, res;
      
        beforeEach(() => {
          req = {};
          res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
          };
        });
            
        it('should render productDetailInDashboard template with the specified product', async () => {

        req.params = { productId: 'mockProductId' };
      
        Product.findById = jest.fn(() => ({/*Lorem ipsum*/}));
      
        //Call the function
        await productController.showProductInDashboard(req, res);
      
        //Assertions
        expect(res.render).toHaveBeenCalledWith('productDetailInDashboard', { product: expect.any(Object) });
          expect(Product.findById).toHaveBeenCalledWith('mockProductId');
        });
            
    });
      
});
