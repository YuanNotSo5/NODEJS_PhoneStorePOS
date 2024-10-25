const Invoice = require('../models/invoice.js');

class invoiceService {

    findInvoices() {
        return new Promise( async (resolve, reject)=>{
            try {
                const invoices = await Invoice.find()
                    .select()
                    .exec();

                resolve({
                    status: 'success',    
                    invoices: invoices 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })
    }


    findInvoicesById(id) {
        return new Promise( async (resolve, reject)=>{
            try {
                const invoices = await Invoice.find({_id: id})
                    .select()
                    .exec();

                resolve({
                    status: 'success',    
                    invoices: invoices 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })
    }


    //Tìm kiếm lịch sử mua khách hàng
    findHistoryOfCus(phoneNum){
        return new Promise(async (resolve, reject)=>{
            try {
                const history = await Invoice.find({idCus: phoneNum}).exec();
                if(!history) {
                    reject ({
                        status: 'fail',
                        message: 'Khách hàng chưa mua đơn nào'
                    });
                }
                resolve ({
                    status: 'success',
                    history:history
                    
                })
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    findInvoicesByEmployee(id) {
      return new Promise( async (resolve, reject)=>{
          try {
              const invoices = await Invoice.find({idEmp: id})
                  .select()
                  .exec();

              resolve({
                  status: 'success',    
                  invoices: invoices 
              });
          } catch (err) {
              reject({
                  status: 'fail',    
                  error: err 
              });
          }
      })
  }
    
    findInvoicesForToday(lowerDate, upperDate) {
        return new Promise(async (resolve, reject) => {
            try {    
                const todayString = lowerDate.toISOString();
                const tomorrowString = upperDate.toISOString();
                var invoices = await Invoice.find({ date: { $gte: todayString, $lt: tomorrowString } }).exec();
                resolve({
                    status: 'success',
                    invoices: invoices
                });
            } 
            catch (err) {
                console.error('error:', err);
                reject({
                    status: 'fail',
                    error: err
                })
            }
        })
    }

    addInvoice(totalAmount, products, receivedMoney, changes, date, idEmp, idCus, revenue) {
        return new Promise(async (resolve, reject) => {
          if (!totalAmount || !products || !receivedMoney || !changes || !date || !idEmp || !idCus || !revenue) {
            
            reject({
              status: 'fail',
              error: 'Thiếu thông tin hoá đơn'
            });
          }
          console.log(totalAmount)
      
          const newInvoice = new Invoice({
            totalAmount,
            products,
            receivedMoney,
            changes,
            date,
            idEmp,
            idCus,
            revenue
          });
      
          try {
            const savedInvoice = await newInvoice.save();
            resolve({
              status: 'success',
              message: {
                "totalAmount": savedInvoice.totalAmount,
                "products": savedInvoice.products,
                "receivedMoney": savedInvoice.receivedMoney,
                "changes": savedInvoice.changes,
                "date": savedInvoice.date,
                "idEmp": savedInvoice.idEmp,
                "idCus": savedInvoice.idCus,
                "revenue": savedInvoice.revenue,
              }
            });
          } catch (err) {
            reject({
              status: 'fail',
              error: err.message
            });
          }
        }); 
    }
    
    
    
}

module.exports = new invoiceService;
