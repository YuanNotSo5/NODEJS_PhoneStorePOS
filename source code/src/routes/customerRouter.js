const verifyAccount = require('../auth/checkLogin.js');
const customerController = require('../controllers/customerController.js');

function customerRouter(app) {

    app.get('/customers',  customerController.getAllCustomers); // lấy ra tất cả khách hàng
    app.post('/api/customer', customerController.postNewCustomer); // thêm khách hàng 
    app.get('/api/customer/:_phone', customerController.getCustomerByPhone); // lây ra khách hàng cần chỉnh sửa  
    app.put('/api/customer/:_phone', customerController.updateCustomerByPhone);  // cập nhật khách hàng
    app.delete('/api/customer/:_phone', customerController.deleteCustomerByPhone); // xoá khách hàng
    app.get('/customers/history/:id',customerController.getHistoryInvoices); //lấy lịch sử hóa đơn người dùng
}
module.exports = customerRouter;