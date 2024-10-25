const invoiceService = require('../services/invoiceService.js');
const productService = require('../services/productService.js');
const accountService = require('../services/accountService.js');
const customerService = require('../services/customerService.js');
const employeeService = require('../services/employeeService.js');

const Invoice = require('../models/invoice.js');

class invoiceController {
    //[GET] invoice                                       
    getInvoices = async (req, res) => {
        try {
            let invoices = await invoiceService.findInvoices();
            if(invoices.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    invoices: invoices.invoices 
                });
            }
            else{
                res.status(400).json({ message: invoices.error});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    getInvoicesRender = async (req, res) => {
        try {
            var user = req.session.user
            let invoiceProducts = []
            if(user.role == 1){
                let invoices = await invoiceService.findInvoices();
                if (invoices.status === 'success') {
                    invoiceProducts = await Promise.all(invoices.invoices.map(async (category) => {
                        const productList = category.products
    
                        for(var i = 0; i < productList.length; i++){
                            const products = await productService.findProductByBarcode2(productList[i].barcode);
    
                            return {
                                _id: category._id,
                                totalAmount: category.totalAmount,
                                changes: category.changes,
                                date: category.date,
                                idEmp: category.idEmp,
                                idCus: category.idCus,
                                revenue: category.revenue,
                                receivedMoney: category.receivedMoney,
    
                                products: products.status === 'success' ? products.message.map(product => ({
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
                        }
                    }));
                }
            }
            else{
                let invoices = await invoiceService.findInvoicesByEmployee(user.id);
                let account = await accountService.findAccountById(user.id)
                if (invoices.status === 'success') {
                    invoiceProducts = await Promise.all(invoices.invoices.map(async (category) => {
                        const productList = category.products
    
                        for(var i = 0; i < productList.length; i++){
                            const products = await productService.findProductByBarcode2(productList[i].barcode);
    
                            return {
                                _id: category._id,
                                totalAmount: category.totalAmount,
                                changes: category.changes,
                                date: category.date,
                                idEmp: category.idEmp,
                                EmpName: account.message.username,
                                idCus: category.idCus,
                                revenue: category.revenue,
                                receivedMoney: category.receivedMoney,
    
                                products: products.status === 'success' ? products.message.map(product => ({
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
                        }
                    }));
                }
            }
            res.render("admin/index", {invoiceProducts: invoiceProducts });

        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    getInvoicesDetailRender = async (req, res) => {
        try {
            var id = req.params.id
            let invoices = await invoiceService.findInvoicesById(id);
            
            let invoiceProducts = []
            if (invoices.status === 'success') {
                invoiceProducts = await Promise.all(invoices.invoices.map(async (category) => {
                    const productList = category.products
                    const customer = await customerService.findCustomerByPhone(category.idCus)
                    const account = await accountService.findAccountById(category.idEmp)
                    const employee = await employeeService.findEmployeeByEmail(account.message.gmail)
                    


                    for(var i = 0; i < productList.length; i++){
                        const products = await productService.findProductByBarcode2(productList[i].barcode);

                        return {
                            _id: category._id,
                            totalAmount: category.totalAmount,
                            changes: category.changes,
                            date: category.date,
                            idEmp: category.idEmp,
                            idCus: category.idCus,
                            revenue: category.revenue,
                            receivedMoney: category.receivedMoney,
                            customer: [{
                                phone: customer.message._phone,
                                name: customer.message.name,
                                address: customer.message.address,
                            }],
                            employee: [{
                                _id: employee.message._id,
                                fullname: employee.message.fullname,
                                profileImg: employee.message.profileImg,
                                phoneNumber: employee.message.phoneNumber,
                                address: employee.message.address,
                                gmail: employee.message.gmail,
                            }],

                            products: products.status === 'success' ? products.message.map(product => ({
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
                                quantity: productList[i].quantity,
                                price: productList[i].price,
                            })) : []
                        };
                    }
                }));
            }
            res.render("admin/invoiceDetail", {invoiceProducts: invoiceProducts });

        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    postNewInvoice = async (req, res) => {

        try {
           const session_id = req.session.user.id;
            let result = await invoiceService.addInvoice(
                req.body.totalAmount, 
                req.body.products, 
                req.body.receivedMoney,
                req.body.changes, 
                req.body.date, 
                session_id,
                req.body.idCus, 
                req.body.revenue
            );
            console.log(result)
            if(result.status==='success'){
                res.status(201).json({ 
                    message: 'Success', 
                    invoice: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
            res.status(500).json({ message: error });
            console.log(error);
        }
        
    };
    
    
}

module.exports = new invoiceController;