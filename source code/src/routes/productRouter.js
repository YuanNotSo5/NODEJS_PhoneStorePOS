const verifyToken = require('../auth/checkLogin.js');
const productController = require('../controllers/productController.js');
const categoryController = require('../controllers/categoryController.js');

function productRouter(app) {
    //Home
    app.get('/', productController.getHome)

    //Product UI
    app.get('/products', productController.getProducts);
    app.get('/products/create', productController.addProducts);
    app.post('/products/create', productController.addProducts);

    //Category
    app.get('/products/category', categoryController.getAllCategory);
    app.post('/products/category', categoryController.postNewCategory);
    app.get('/products/category/:id', categoryController.getCateById);
    app.put('/products/category/:id', categoryController.putCategory);
    app.delete('/products/category/:id', categoryController.delCategory);

    //Product API
    app.get('/api/products', productController.getAllProducts);
    

    app.post('/api/products', productController.postNewProduct);
    app.get('/api/products/:id', productController.getProductByBarcode); // lấy sp 
    app.put('/api/products/:id', productController.updateProductByBarcode); // update
    app.put('/api/products/sell/:id', productController.sellProductByBarcode);
    app.delete('/api/products/:id', productController.deleteProductByBarcode);

    app.get('/api/products_category/:category', productController.getAllProductsByCategory);
}
module.exports = productRouter;