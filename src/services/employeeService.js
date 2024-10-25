const Employee = require('../models/employee.js')

class employeeService {

    findAllEmployees() {
        return new Promise( async (resolve, reject)=>{
            try {
                var result = await Employee.find().exec();
                resolve({
                    status: 'success',    
                    employees: result 
                });
            } catch (err) {
                reject({
                    status: 'fail',    
                    error: err 
                });
            }
        })

    }

    addEmployee(fullname, profileImg, phoneNumber, address, gmail){

        return new Promise (async (resolve, reject)=>{
            if (!fullname || !gmail) {
                reject({ 
                    status: 'fail',
                    error: 'Thiếu thông tin nhân viên' 
                });
            }
        
            const newEmployee = new Employee({
                fullname, profileImg, phoneNumber, address, gmail
            });
    
            try {
                const savedEmployee = await newEmployee.save();
                resolve({
                    status: 'success',
                    message: {
                        "_id": savedEmployee._id,
                        "fullname": savedEmployee.fullname,
                        "profileImg": savedEmployee.profileImg,
                        "phoneNumber": savedEmployee.phoneNumber,
                        "address": savedEmployee.address,
                        "gmail": savedEmployee.gmail,
                    }
                })
            } catch (err) {
                reject({ 
                    status: 'fail',
                    error: err.message
                });
            }
        });
    }

    findEmployeeById(id){
        return new Promise(async (resolve, reject)=>{
            try {
                const employee = await Employee.findOne({_id: id})
                    .exec();
                if(!employee) {
                    reject ({
                        status: 'fail',
                        message: 'Nhân viên không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: {
                        "_id": employee._id,
                        "fullname": employee.fullname,
                        "profileImg": employee.profileImg,
                        "phoneNumber": employee.phoneNumber,
                        "address": employee.address,
                        "gmail": employee.gmail,
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

    findEmployeeByEmail(email){
        return new Promise(async (resolve, reject)=>{
            try {
                const employee = await Employee.findOne({gmail: email})
                    .exec();
                if(!employee) {
                    reject ({
                        status: 'fail',
                        message: 'Nhân viên không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: {
                        "_id": employee._id,
                        "fullname": employee.fullname,
                        "profileImg": employee.profileImg,
                        "phoneNumber": employee.phoneNumber,
                        "address": employee.address,
                        "gmail": employee.gmail,
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

    updateEmployee(id, updateData){
        return new Promise (async (resolve, reject) => {
            try {
                const updatedEmployee = await Employee.findOneAndUpdate({_id: id}, updateData, {new: true});
                if (!updatedEmployee) {
                    reject ({
                        status: 'fail',
                        message: 'Sản phẩm không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: {
                        "_id": updatedEmployee._id,
                        "fullname": updatedEmployee.fullname,
                        "profileImg": updatedEmployee.profileImg,
                        "phoneNumber": updatedEmployee.phoneNumber,
                        "address": updatedEmployee.address,
                        "gmail": updatedEmployee.gmail,
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

    deleteEmployee(email){
        return new Promise (async (resolve, reject)=>{
            try {
                const deletedEmployee = await Employee.findOneAndRemove({gmail: email });
                    if (!deletedEmployee) {
                        reject ({
                            status: 'fail',
                            message: 'Nhân viên không tồn tại'
                        });
                    }
                    resolve ({
                        status: 'success',
                        message: 'Nhân viên đã được xóa thành công'
                    })
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }
}
module.exports = new employeeService;
