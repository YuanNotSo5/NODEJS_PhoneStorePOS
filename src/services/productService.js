const Product = require('../models/product.js')
const categoryService = require('../services/categoryService.js');
class productService {

    findAllProducts() {
        return new Promise( async (resolve, reject)=>{
            try {
                var result = await Product.find().exec();
                resolve({
                    status: 'success',    
                    products: result 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })
    }


    findAllOfCategory(nameCategory) {
        return new Promise( async (resolve, reject)=>{
            try {
                var result = await Product.find({ category: nameCategory }).exec();
                resolve({
                    status: 'success',    
                    products: result 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })
    }

    addProduct(_barcode, name, importPrice, retailPrice, creationDate, category, branch, description, totalQuantity, fileName){
        return new Promise (async (resolve, reject)=>{
            if (!_barcode || !name || !importPrice || !retailPrice || !category || !branch) {
                reject({ 
                    status: 'fail',
                    error: 'Thiếu thông tin sản phẩm' 
                });
            }
        
            const newProduct = new Product({
                _barcode, name, importPrice, retailPrice, creationDate, category, branch, description, totalQuantity, fileName
            });
    
            try {
                const savedProduct = await newProduct.save();
                resolve({
                    status: 'success',
                    message: {
                        "_barcode": savedProduct._barcode,
                        "name": savedProduct.name,
                        "importPrice": savedProduct.importPrice,
                        "retailPrice": savedProduct.retailPrice,
                        "creationDate": savedProduct.creationDate,
                        "category": savedProduct.category,
                        "branch": savedProduct.branch,
                        "description": savedProduct.description,
                        "totalQuantity": savedProduct.totalQuantity,
                        "sold": savedProduct.sold,
                        "fileName": savedProduct.fileName,
                    }
                })
            } catch (err) {
                reject({ 
                    status: 'fail',
                    error: err.message
                });
            }
        });
    }

    findProductByBarcode(barcode){
        return new Promise(async (resolve, reject)=>{
            try {
                const product = await Product.findOne({_barcode: barcode})
                    .exec();
                if(!product) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: {
                        "_barcode": product._barcode,
                        "name": product.name,
                        "importPrice": product.importPrice,
                        "retailPrice": product.retailPrice,
                        "creationDate": product.creationDate.toUTCString(),
                        "category": product.category,
                        "branch": product.branch,
                        "description": product.description,
                        "totalQuantity": product.totalQuantity,
                        "sold": product.sold,
                        "fileName": product.fileName,
                    }
                })
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    findProductByBarcode2(barcode){
        return new Promise(async (resolve, reject)=>{
            try {
                const product = await Product.findOne({_barcode: barcode})
                    .exec();
                if(!product) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: [product]
                })
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    updateProduct(barcode, updateData){
        return new Promise (async (resolve, reject) => {
            try {
                const updatedProduct = await Product.findOneAndUpdate({_barcode: barcode}, updateData, {new: true});
                if (!updatedProduct) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: {
                        "_barcode": updatedProduct._barcode,
                        "name": updatedProduct.name,
                        "importPrice": updatedProduct.importPrice,
                        "retailPrice": updatedProduct.retailPrice,
                        "creationDate": updatedProduct.creationDate.toUTCString(),
                        "category": updatedProduct.category,
                        "branch": updatedProduct.branch,
                        "description": updatedProduct.description,
                        "totalQuantity": updatedProduct.totalQuantity,
                        "sold": updatedProduct.sold,
                    }
                })
            } 
            catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    sellProduct(barcode){
        return new Promise (async (resolve, reject) => {
            try {
                const updatedProduct = await Product.findOneAndUpdate({_barcode: barcode},{ $set: { sold: true } }, {new: true});
                const updatedCategory = await categoryService.updatedCategory(updatedProduct.category);
                if (!updatedProduct) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: updatedProduct,
                })
            } 
            catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    deleteProduct(barcode){
        return new Promise (async (resolve, reject)=>{
            try {
                const isCheck = await Product.findOne({_barcode: barcode}).exec();
                if(isCheck.sold){
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm đã bán không thể xóa'
                    });
                }
                else{
                    const deletedProduct = await Product.findOneAndRemove({ _barcode: barcode });
                    if (!deletedProduct) {
                        reject ({
                            status: 'fail',
                            message: 'Sản phẩm không tồn tại'
                        });
                    }
                    resolve ({
                        status: 'success',
                        message: 'Sản phẩm đã được xóa thành công'
                    })
                }
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }
}
module.exports = new productService;
