const productService = require('../services/productService.js')
const Product = require('../models/product.js');
const multer = require('multer');
const categoryService = require('../services/categoryService.js');
const product = require('../models/product.js');
class productController {
    //[GET]/Home

    
    getHome = async (req, res) => {
        try {
            const cateList = await categoryService.findAllCategory();
            if (cateList.status === 'success') {
                const categoriesWithProducts = await Promise.all(cateList.category.map(async (category) => {
                    const products = await productService.findAllOfCategory(category.category);
                    return {
                        _id: category._id,
                        name: category.category,
                        fileName: category.fileName,
                        products: products.status === 'success' ? products.products.map(product => ({
                            _id: product._id,
                            barcode: product._barcode,
                            name: product.name,
                            importPrice: product.importPrice,
                            retailPrice: product.retailPrice,
                            creationDate: product.creationDate,
                            category: product.category,
                            branch: product.branch,
                            description: product.description,
                            totalQuantity: product.totalQuantity,
                            sold: product.sold,
                            fileName: product.fileName, 
                        })) : []
                    };
                }));
                res.render("index", { loginSuccess: req.flash('loginSuccess'), categoriesWithProducts: categoriesWithProducts });
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    
    
    
    
    
    // UI
    getProducts = async (req, res) => {
        try {
            let result = await productService.findAllProducts();
            let cateList = await categoryService.findAllCategory();
            if (result.status === 'success' && cateList.status === 'success') {
                const flattenedProducts = result.products.map(product => {
                    return {
                        _id: product._id,
                        barcode: product._barcode,
                        name: product.name,
                        retailPrice: product.retailPrice,
                        importPrice: product.importPrice,
                        totalQuantity: product.totalQuantity,
                        creationDate: product.creationDate,
                    };
                });    
                const flattenCate = cateList.category.map(cate => {
                    return {
                        _id: cate._id,
                        name: cate.category,
                    };
                });
                res.render('products/index', { listProducts: flattenedProducts, listCate: flattenCate });
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    //Add Image
    addProducts = async (req,res) => {
        const path = ".\\public\\images\\productImg";
        const storage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null, path);
            },
            filename: (req,file,cb) => {
                cb(null,file.originalname);
            }
        })
        const upload = multer({storage: storage,limits: {fieldSize: 1*1024*1024}}).single('file');
        upload(req,res,(err)=>{
            if(err) {
                req.flash('UploadError','Can not upload file');
                res.json({err})
                return;
            }
            req.flash('UploadSuccess','Upload file success');
            res.status(200).json({
                "msg":"success",
            })
        })
    }
    
    // API
    //[GET] products                                       
    getAllProducts = async (req, res) => {
        try {
            let result = await productService.findAllProducts();
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    products: result.products 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    };

    getAllProductsByCategory = async (req, res) => {
        try {
            var category = req.params.category;
            let cateList = await categoryService.findAllCategory();
            let choseCate = await categoryService.findCategoryByName(category);
            var result = await productService.findAllOfCategory(category);
    
            if (cateList.status === 'success') {
                const uniqueBranches = Array.from(new Set(result.products.map(product => product.branch)));
    
                const categoriesWithProducts = cateList.category.map(category => ({
                    _id: category._id,
                    name: category.category,
                    fileName: category.fileName,
                }));
    
                const flattenedProducts = result.products.map(product => ({
                    _id: product._id,
                    barcode: product._barcode,
                    name: product.name,
                    fileName: product.fileName,
                    retailPrice: product.retailPrice,
                    importPrice: product.importPrice,
                    totalQuantity: product.totalQuantity,
                    creationDate: product.creationDate,
                    branch: product.branch
                }));
    
                res.render("products/productInCategory", {
                    products: flattenedProducts,
                    categoriesWithProducts: categoriesWithProducts,
                    choseCategory: choseCate.message,
                    uniqueBranches: uniqueBranches
                });
            } else {
                res.status(400).json({ message: result.error });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    };
    

    //[POST] api/products
    postNewProduct = async (req, res) => {
        try {
            let result = await productService.addProduct(req.body.barcode, req.body.name, req.body.importPrice, req.body.retailPrice, req.body.creationDate, req.body.category, req.body.branch, req.body.description, req.body.totalQuantity,req.body.fileName);
            if(result.status=='success'){
                res.status(201).json({ 
                    message: 'Success', 
                    product: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };

    // [GET] api/products/:id
    getProductByBarcode = async (req, res) => {
        try {
            const barcode = req.params.id; 
            let product = await productService.findProductByBarcode(barcode);
            if(product.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    product: product.message 
                });
            }
            else{
                res.status(400).json({ message: product.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }
  
    // [PUT] api/products/:id
    updateProductByBarcode = async (req, res) => {
        try {
            const barcode = req.params.id;
            const updateData = req.body;

            let updatedProduct = await productService.updateProduct(barcode, updateData);
            if(updatedProduct.status=='success'){
                req.flash('deleteSuccess', 'Delete Successfully');
                res.status(200).json({ 
                    message: 'Success', 
                    product: updatedProduct.message 
                });
            }
            else{
                req.flash('deleteFail', 'Delete Fail');
                res.status(400).json({ message: updatedProduct.message});
            }
        } catch (error) {
          console.log(error);
          req.flash('deleteFail', 'Delete Fail '+error);
          res.status(500).json({ message: error });
        }
    }

    // [PUT] api/products/:id
    sellProductByBarcode = async (req, res) => {
        try {
            const barcode = req.params.id;
            let result = await productService.sellProduct(barcode);
            if(result.status=='success'){
                req.flash('deleteSuccess', 'Delete Successfully');
                res.status(200).json({ 
                    message: 'Success', 
                    product: result.message 
                });
            }
            else{
                req.flash('deleteFail', 'Delete Fail');
                res.status(400).json({ message: result.message});
            }
        } catch (error) {
          console.log(error);
          req.flash('deleteFail', 'Delete Fail '+error);
          res.status(500).json({ message: error });
        }
    }
  
    // [DELETE] api/products/:id
    deleteProductByBarcode = async (req, res) => {
        try {
            const barcode = req.params.id;
            let result = await productService.deleteProduct(barcode);
            if(result.status=='success'){
                res.status(200).json({ 
                    message: result.message
                });
            }
            else{
                res.status(400).json({ message: result.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }
}
module.exports = new productController;