const Customer = require('../models/customer.js');

class customerService {
  async findAllCustomers() {
    try {
      const result = await Customer.find().exec();
      return {
        status: 'success',
        customers: result,
      };
    } catch (err) {
      throw {
        status: 'fail',
        error: err,
      };
    }
  }


  async addCustomer(_phone, name, address) {
    console.log('chạy vô addcustomer')
    console.log(_phone)
    console.log(name)
    console.log(address)
    if (!_phone || !name || !address) {
      throw {
        status: 'fail',
        error: 'Thiếu thông tin khách hàng',
      };
    }

    const newCustomer = new Customer({
      _phone,
      name,
      address,
    });
    try {
      const savedCustomer = await newCustomer.save();

      return {
        status: 'success',
        message: {
          _phone: savedCustomer._phone,
          name: savedCustomer.name,
          address: savedCustomer.address,
        },
      };
    } catch (err) {
      console.error(err);
      throw {
        status: 'fail',
        error: err.message,
      };
    }
  }



  findCustomerByPhone(_phone){
    return new Promise(async (resolve, reject)=>{
        try {
            const customer = await Customer.findOne({_phone: _phone})
                .exec();
            if(!customer) {
                reject ({
                    status: 'fail',
                    message: 'Khách hàng không tồn tại'
                });
            }
            resolve ({
                status: 'success',
                message: {
                    "_phone": customer._phone,
                    "name": customer.name,
                    "address": customer.address
                }
            })
        } catch (err) {
            reject ({
                status: 'fail',
                message: err.message
            });
        }
    })
}



  async updateCustomer(_phone, updateData){
    return new Promise (async (resolve, reject) => {
        try {
            const updatedCustomer = await Customer.findOneAndUpdate({_phone: _phone}, updateData, {new: true});
            
            if (!updatedCustomer) {
                reject ({
                    status: 'fail',
                    message: 'Khách hàng không tồn tại'
                });
            }
            resolve ({
                status: 'success',
                message: {
                    "_phone": updatedCustomer._phone,
                    "name": updatedCustomer.name,
                    "address": updatedCustomer.address

                }
            })
        }
        catch (err) {
            reject ({
                status: 'fail',
                message: err.message
            });
        }
    })
}

  
async deleteCustomer(_phone) {
  return new Promise(async (resolve, reject) => {
      try {
          const deletedProduct = await Customer.findOneAndRemove({ _phone: _phone });
          if (!deletedProduct) {
              reject({
                  status: 'fail',
                  message: 'Khách hàng không tồn tại'
              });
          }

          resolve({
              status: 'success',
              message: 'Khách hàng đã được xoá thành công'
          });
        }
      catch (err) {
          reject({
              status: 'fail',
              message: err.message
          });
      }
  });
}

}
module.exports = new customerService();