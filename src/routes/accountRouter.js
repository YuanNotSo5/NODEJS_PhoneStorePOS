const verifyAccount = require('../auth/checkLogin.js');
const homeController = require('../controllers/homeController.js');
function accountRouter(app) {
    //Login & Register
    app.get('/login', homeController.getLogin)

    
    app.post('/api/account/login', homeController.postLogin);
    app.post('/api/account/register', homeController.postRegister);
    app.get('/logout', homeController.destroySession)

    app.get('/api/account',verifyAccount, homeController.getAccountInfo)
    app.put('/api/account',verifyAccount, homeController.updateAccountInfo)
    app.post('/api/account',verifyAccount, homeController.changePassword)

    app.get("/getSession", verifyAccount, homeController.getSession)
}
module.exports = accountRouter;