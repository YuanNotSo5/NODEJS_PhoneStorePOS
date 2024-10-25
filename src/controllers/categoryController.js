const categoryService = require('../services/categoryService.js')
const multer = require('multer');
class categoryController {    
    // API
    //[GET] products                                       
    getAllCategory = async (req, res) => {
        try {
            let result = await categoryService.findAllCategory();
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    category: result.category 
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

    //[POST] api/category
    postNewCategory = async (req, res) => {
        try {
            let result = await categoryService.createCategory(req.body.nameCategory, req.body.fileName);
            if(result.status=='success'){
                res.status(201).json({ 
                    message: 'Success', 
                    category: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };

    // [GET] api/category/:id
    getCateById = async (req, res) => {
        try {
            const id = req.params.id; 
            let result = await categoryService.findCategoryId(id);
            if (result.status === 'success') {
                res.status(200).json({ 
                    message: 'Category found successfully', 
                    category: result.message 
                });
            } else {
                res.status(404).json({ message: 'Category not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

  
    // [PUT] api/category/:id
    putCategory = async (req, res) => {
        try {
            const id = req.params.id;
            let result = await categoryService.updatedCategory(id);
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    category: result.message 
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
  
    // [DELETE] api/category/:id
    delCategory = async (req, res) => {
        try {
            const id = req.params.id;
            let result = await categoryService.deleteCategory(id);
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
module.exports = new categoryController;