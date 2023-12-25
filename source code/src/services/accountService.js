const Account = require('../models/account.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();

class accountService {
    findAccount(email,pass) {
        return new Promise(async (resolve, reject) => {
            try{
                var result = await Account.findOne({
                    gmail: email,
                }).exec()

                if (result != null) {
                    if(result.isActived == false){
                        reject({
                            status: 'fail',
                            message: "Your Account Hasn't Activated"
                        });
                    }

                    var token = jwt.sign({
                        id:  result._id
                    },process.env.KEY, {expiresIn: "1h"});

                    var compare = await this.checkPassword(pass, result.hash_password)

                    if(compare){
                        resolve({
                            status: 'success',
                            name: result.username,
                            account: result._id,
                            role: result.authorization,
                            token: token 
                        });
                        
                    }else{
                        reject({
                            status: 'fail',
                            message: 'Invalid Email, Password'
                        });
                    }
                    
                } else {
                    
                }
            }
            catch(err){
                console.log(err);
                reject(
                    {
                        status: 'error',
                        message: err
                    }
                );
            }
            
        });
    }
    findAccountByEmail(email) {
        return new Promise( (resolve, reject) => {
            
            Account.findOne({
                gmail: email,
            })
            .then(result => {
                if (result != null) {
                    resolve({
                        status: 'success',
                        message: result
                    });
                    
                } else {
                    reject({
                        status: 'fail',
                        message: "Email does not exist"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject(
                    {
                        status: 'error',
                        message: err
                    }
                );
            });
        });
    }

    findAccountById(id) {
        return new Promise( (resolve, reject) => {
            
            Account.findOne({
                _id: id,
            })
            .then(result => {
                if (result != null) {
                    resolve({
                        status: 'success',
                        message: {
                            "_id": result._id,
                            "username": result.username,
                            "password": result.password,
                            "hash_password": result.hash_password,
                            "gmail": result.gmail,
                            "isLocked": result.isLocked,
                            "isActived": result.isActived,
                            "authorization": result.authorization,
                        }
                    });
                    
                } else {
                    reject({
                        status: 'fail',
                        message: "Id does not exist"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject(
                    {
                        status: 'error',
                        message: err
                    }
                );
            });
        });
    }

    deleteAccount(id){
        return new Promise (async (resolve, reject)=>{
            try {
                const deletedEmployee = await Account.findOneAndRemove({_id: id });
                    if (!deletedEmployee) {
                        reject ({
                            status: 'fail',
                            message: 'Tài khoản không tồn tại'
                        });
                    }
                    resolve ({
                        status: 'success',
                        message: 'Tài khoản đã được xóa thành công'
                    })
            } catch (err) {
                reject ({
                    status: 'fail',
                    message: err.message
                });
            }
        })
    }

    async checkPassword(pass, hass){
        var result =  await bcrypt.compareSync(pass, hass)
        return result
    }

    addAccount(gmail, username, password){
        var hash_pwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        const newAccount = new Account({
            gmail: gmail,
            username: username,
            password: password,
            hash_password: hash_pwd,
        });
        return new Promise((resolve, reject)=>{
            newAccount.save(newAccount)
                .then((result)=>{
                    resolve({
                        status: 'success',
                        message: result 
                    });
                })
                .catch((err)=>
                    reject({
                        status: 'fail',
                        message: err 
                    })
                );
        });
    }
    activateAccount(email){
        return new Promise( (resolve, reject) => {
            
            Account.findOne({
                gmail: email,
            })
            .then(result => {
                if (result != null) {
                    if(result.isActived == false){
                        result.isActived = true
                        result.save()
                        resolve({
                            status: 'success',
                            message: "Account activated successfully"
                        });
                    }else{
                        resolve({
                            status: 'success',
                            message: "Account already activated"
                        });
                    }
                    
                    
                } else {
                    reject({
                        status: 'fail',
                        message: "Account does not exist"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject(
                    {
                        status: 'error',
                        message: err
                    }
                );
            });
        });
    }

    updateAccount(id, updateData){
        return new Promise (async (resolve, reject) => {
            try {
                const updatedAccount = await Account.findOneAndUpdate({_id: id}, updateData, {new: true});
                if (!updatedAccount) {
                    reject ({
                        status: 'fail',
                        message: 'Tài khoản không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: updatedAccount
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

    changePassword(id, password){
        return new Promise (async (resolve, reject) => {
            try {
                var hash_pwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                const updatedAccount = await Account.findOneAndUpdate({_id: id}, {password: password, hash_password: hash_pwd}, {new: true});
                if (!updatedAccount) {
                    reject ({
                        status: 'fail',
                        message: 'Tài khoản không tồn tại'
                    });
                }
                resolve ({
                    status: 'success',
                    message: updatedAccount
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
}

module.exports = new accountService;
