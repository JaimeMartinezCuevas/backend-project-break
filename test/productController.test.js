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

    // Test for showProducts function
    test('should render products', async () => {

      // Mock Product.find to return products
      Product.find.mockResolvedValueOnce([mockProduct]);
      
      const req = { originalUrl: 'http://localhost:3000/products' };
      const res = {
        render: jest.fn(),
        status: jest.fn(),
      };

      await productController.showProducts(req, res);

      // Assert that the render function was called with the correct parameters
      expect(res.render).toHaveBeenCalledWith('products', { products: [mockProduct] });
    });

  });

});
