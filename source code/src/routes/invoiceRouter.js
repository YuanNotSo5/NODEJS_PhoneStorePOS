const verifyAccount = require('../auth/checkLogin.js');
const invoiceController = require('../controllers/invoiceController.js');

function invoiceRouter(app) {
    app.get('/api/invoices', verifyAccount, invoiceController.getInvoices);
    app.get('/invoices', verifyAccount, invoiceController.getInvoicesRender);
    app.get('/invoices/details/:id', verifyAccount, invoiceController.getInvoicesDetailRender);

    app.post('/api/invoice', verifyAccount, invoiceController.postNewInvoice);

}


module.exports = invoiceRouter;