const Category = require('../models/category.js');
const Product = require('../models/product.js');
class categoryService {
    findAllCategory() {
        return new Promise( async (resolve, reject)=>{
            try {
                const category = await Category.find().exec();
                resolve({
                    status: 'success',    
                    category: category 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })
    }

    createCategory(category,fileName){
        return new Promise (async (resolve, reject)=>{
            if (!category) {
                reject({ 
                    status: 'fail',
                    error: 'Thiếu thông tin thể loại' 
                });
            }
            const newCategory = new Category({category,fileName});
            try {
                const savedCategory = await newCategory.save();
                resolve({
                    status: 'success',
                    message: savedCategory
                })
            } catch (err) {
                reject({ 
                    status: 'fail',
                    error: err
                });
            }
        });
    }

    findCategoryId(idCategory) {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await Category.findById(idCategory).exec();
                if (!category) {
                    reject({
                        status: 'fail',
                        message: 'Thể loại không tồn tại'
                    });
                }
                resolve({
                    status: 'success',
                    message: category
                });
            } catch (err) {
                reject({
                    status: 'fail',
                    message: err.message
                });
            }
        });
    }

    findCategoryByName(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await Category.findOne({category: name}).exec();
                if (!category) {
                    reject({
                        status: 'fail',
                        message: 'Thể loại không tồn tại'
                    });
                }
                resolve({
                    status: 'success',
                    message: category
                });
            } catch (err) {
                reject({
                    status: 'fail',
                    message: err.message
                });
            }
        });
    }
    
    updatedCategory(nameCategory){
        return new Promise (async (resolve, reject) => {
            try {
                const updatedCategory = await Category.findOneAndUpdate(
                    { category: nameCategory },
                    { exists: true },
                    { new: true } // This option returns the modified document rather than the original
                );
                if (!updatedCategory) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: updatedCategory
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

    deleteCategory(idCategory) {
        return new Promise(async (resolve, reject) => {
            try {
                const isCheck = await Category.findById(idCategory).exec();
    
                if (isCheck.exists) {
                    reject({
                        status: 'fail',
                        message: 'Không thể xóa thể loại này'
                    });
                    return; // Exit the function early
                }
    
                const deletedCategory = await Category.findOneAndRemove({ _id: idCategory });
                const deletedProducts = await Product.deleteMany({ category: isCheck.category });
    
                console.log(deletedProducts);
    
                if (!deletedCategory) {
                    reject({
                        status: 'fail',
                        message: 'Thể loại không tồn tại'
                    });
                } else {
                    resolve({
                        status: 'success',
                        message: 'Thể loại đã được xóa thành công'
                    });
                }
            } catch (err) {
                reject({
                    status: 'fail',
                    message: err.message
                });
            }
        });
    }
    
}
module.exports = new categoryService;
