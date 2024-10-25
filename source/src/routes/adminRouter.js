const verifyAccount = require('../auth/checkLogin.js');
const adminController = require('../controllers/adminController.js');
const employeeController = require('../controllers/employeeController.js');

function adminRouter(app) {
    
    //Admin
    // app.get('/admin', verifyAccount, adminController.getAdmin)
    app.get('/admin/account_employee', verifyAccount, adminController.getAllAccount)

    app.get('/admin/api/account_employee/:id',verifyAccount, adminController.getAccountInfo)
    app.post("/admin/api/account_employee", verifyAccount, adminController.createEmployee)
    app.put("/admin/api/account_employee/:id",  verifyAccount, adminController.updateEmployee)
    app.put("/admin/api/account_employee/lock/:id", verifyAccount,  adminController.lockEmployee)
    app.delete("/admin/api/account_employee/:id", verifyAccount, adminController.deleteEmployee)

    app.post("/admin/sendEmail", verifyAccount, adminController.sendEmail)
    app.get("/resendEmail/:email", adminController.resendEmail)
    app.get('/mail-track/:token/:email', adminController.mailTrack)

}
module.exports = adminRouter;