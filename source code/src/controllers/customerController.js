const customerService = require('../services/customerService.js');
const Customer = require('../models/customer.js');
const invoiceService = require('../services/invoiceService.js');
const employeeService = require('../services/employeeService.js')
const accountService = require('../services/accountService.js')


class customerController {
    getAllCustomers = async (req, res) => {
        try {
            let result = await customerService.findAllCustomers();
         
            if (result.status === 'success') {
                const flattenedCustomers = result.customers.map(customer => {
                    return {
                        _id: customer._id,
                        _phone: customer._phone,
                        name: customer.name,
                        address: customer.address
                    };
                });    
               
                res.render('customers/index', { listCustomers: flattenedCustomers});
            }
        } catch (error) {
            console.log(error);
        }
    }


    postNewCustomer = async (req, res) => {
        console.log("chạy vô post newcustomer")
        try {
            let result = await customerService.addCustomer(
                req.body._phone, 
                req.body.name, 
                req.body.address
            );
            if(result.status=='success'){
                res.status(201).json({ 
                    message: 'Success', 
                    customers: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };



    // [GET] 
    getCustomerByPhone = async (req, res) => {
        try {
            const _phone = req.params._phone; 
            let customer = await customerService.findCustomerByPhone(_phone);
            if(customer.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    customer: customer.message 
                });

            }
            else{
                res.status(400).json({ 
                    message: customer.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }

    }

     updateCustomerByPhone = async (req, res) => {
        try {
            const _phone = req.params._phone;
            const updateData = req.body;

            let updatedCustomer = await customerService.updateCustomer(_phone, updateData);
            if(updatedCustomer.status ==='success'){
                req.flash('deleteSuccess', 'Delete Successfully');
                res.status(200).json({ 
                    message: 'Success', 
                    customer: updatedCustomer.message 
                });
            }
            else{
                req.flash('deleteFail', 'Delete Fail');
                res.status(400).json({ message: updatedCustomer.message});
            }
        } catch (error) {
          console.log(error);
          req.flash('deleteFail', 'Delete Fail '+error);
          res.status(500).json({ message: error });
        }
    }


    deleteCustomerByPhone = async (req, res) => {
        try {
            const _phone = req.params._phone;
            let result = await customerService.deleteCustomer(_phone);
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

    //Lấy lịch sử mua của khách hàng
    getEmployeeNameById = async (employeeId) => {
        try {
            let result = await employeeService.findEmployeeById(employeeId);
            console.log(result.message)
            
            if(result.status=='success'){
                return result.message.fullname;
            }
            else{
                return "Nhân viên không tồn tại"
            }
        } catch (error) {
            return error.message;

        }
    };
    
    // Now, modify your getHistoryInvoices function
    getHistoryInvoices = async (req, res) => {
        let phoneNum = req.params.id;
        try {
            let HistoryInvoices = await invoiceService.findHistoryOfCus(phoneNum);
            if (HistoryInvoices.status == 'success') {
                const flattenedHistory = await Promise.all(
                    HistoryInvoices.history.map(async (item) => {
                        // Fetch employee name by idEmp
                        const account = await accountService.findAccountById(item.idEmp);
                        const employee = await employeeService.findEmployeeByEmail(account.message.gmail);

                        return {
                            _id: item._id,
                            totalAmount: item.totalAmount,
                            name: item.name,
                            date: item.date,
                            idEmp: item.idEmp,
                            employeeName: employee.message.fullname,
                        };
                    })
                );
                res.render('customers/history', { listHistory: flattenedHistory });
            }
        } catch (error) {
            console.log(error);
        }
    };



}
module.exports = new customerController;