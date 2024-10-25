require('dotenv').config();
const express = require('express');
const hdb = require("express-handlebars")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash')
const moment = require('moment'); // Import the moment library

const app = express();
app.set('view engine', 'handlebars');
app.engine("handlebars",hdb.engine({
  defaultLayout: "main",
}));

app.set('views', __dirname + '/src/views');
app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded());
app.use((session({
  secret: process.env.KEY,
  cookie: {
      sameSite: 'strict',
      resave: false,
      saveUninitialized: true,
      expires: 60000*60
  }
})))
app.use((flash()));
app.use(cookieParser());

//Add handlebars helpers
var hbs = hdb.create({
  helpers: {
    getIdFromListHelper: function(index){
      var result = index + 1
      return result
    },
    toJSON: function(obj) {
      return JSON.stringify(obj);
    },
    formatDate: function (dateString) {
      const formattedDate = moment(dateString).format('DD/MM/YYYY');
      return formattedDate;
    },
    sumQuantities: function (invoices) {
      let sum = 0;
      invoices.forEach(invoice => {
          sum += invoice.quantity;
      });
      return sum;
    },
    sumTotalAmount: function (invoices) {
      let sum = 0;
      invoices.forEach(invoice => {
          sum += invoice.totalAmount;
      });
      return sum;
    },
    sumRevenue: function (invoices) {
      let sum = 0;
      invoices.forEach(invoice => {
          sum += invoice.revenue;
      });
      return sum;
    },
    formatNumberToCurrency: function(numberValue) {
        return numberValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  }
})
app.engine('handlebars', hbs.engine);
//Database connect
const db = require('./src/config/db.config');
//Router
// const router = require('./src/routes');
// router(app);


//Router
// Import các router

const invoiceRouter = require('./src/routes/invoiceRouter.js')
const accountRouter  = require('./src/routes/accountRouter.js');
const productRouter = require('./src/routes/productRouter.js');
const errorRouter = require('./src/routes/errorRouter.js');
const customerRouter = require('./src/routes/customerRouter.js');
const adminRouter = require('./src/routes/adminRouter.js');
const reportsRouter = require('./src/routes/reportsRouter.js');

invoiceRouter(app);
adminRouter(app);
accountRouter(app);
customerRouter(app);
invoiceRouter(app);
productRouter(app);
reportsRouter(app);
errorRouter(app);
//Listen
app.listen(process.env.PORT, () => console.log(
    `Express started on http://localhost:${process.env.PORT}; ` +
    'press Ctrl-C to terminate. '
))