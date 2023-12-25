const errorController = require('../controllers/errorController.js');
function errorRouter(app) {
    //Error
    app.use(errorController.notFound);
    app.use(errorController.serverError);
}
module.exports = errorRouter;