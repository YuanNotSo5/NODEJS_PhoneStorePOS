const verifyAccount = require('../auth/checkLogin.js');
const reportsController = require('../controllers/reportsController.js');
function reportsRouter(app) {
    
    //Admin
    app.get("/reports",verifyAccount, reportsController.getReport)
    app.post("/api/invoices/data",verifyAccount, reportsController.getData)

}
module.exports = reportsRouter;