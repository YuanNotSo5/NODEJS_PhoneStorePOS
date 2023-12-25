const accountService = require('../services/accountService.js')
const employeeService = require('../services/employeeService.js')

class homeController {
    //[GET]/Login
    getLogin = (req,res) => {
        res.render("login");
    }
    
    //[POST]/login
    postLogin = async (req, res) => {
        try {
            let result = await accountService.findAccount(req.body.email, req.body.pass);
   
            if(result.status=='success'){
                req.session.user = {
                    id: result.account,
                    name: result.name,
                    role: result.role,
                    token: result.token
                }

                req.flash('loginSuccess', "Login Successfully");
                res.status(200).json({ message: result.message });
            }
            else{
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ status: error.status, message: error.message });
        }
    }

    //[POST]/register
    postRegister  = async (req,res) => {
        try {
            let result = await accountService.addAccount(req.body.email, req.body.username, req.body.pass);
            if(result.status=="success"){
                res.json({
                    status: 'success',
                    message: result.message
                });
            }
            else{
                res.json({
                    status: 'fail',
                    message: result.message
                });
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    getAccountInfo = async (req, res) => {
        try {
            var user = req.session.user

            var result = await accountService.findAccountById(user.id)

            var account = result.message

            let employee = await employeeService.findEmployeeByEmail(account.gmail);

            res.status(200).json({employee: employee.message, account: account})
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    changePassword = async (req, res) => {
        try {
            var user = req.session.user

            var result = await accountService.changePassword(user.id, req.body.new_password)

            if(result.status == "success")
                res.status(200).json({message: "Đổi mật khẩu thành công"})

        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    updateAccountInfo  = async (req,res) => {
        try {
            var user = req.session.user

            var updatedAccountData = {
                gmail: req.body.email,
                username: req.body.username,
                password: req.body.password,
            }
            var oldEmail = req.body.oldEmail
            let updateAccount = await accountService.updateAccount(user.id, updatedAccountData)
            
            if(updateAccount.status == "success"){
                var updatedEmployeeData = {
                    gmail: req.body.email,
                    fullname: req.body.fullname,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                }
                let employee = await employeeService.findEmployeeByEmail(oldEmail)
                console.log(employee)
                let updateEmployee = await employeeService.updateEmployee(employee.message._id, updatedEmployeeData)

                if(updateEmployee.status == "success"){
                    res.json({
                        status: 'success',
                        message1: updateAccount.message,
                        message2: updateEmployee.message

                    });
                }else{
                    res.json({
                        status: 'fail',
                        message: result.message,
                    });
                }
            }
            else{
                res.json({
                    status: 'fail',
                    message: result.message,
                });
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }
    getSession = (req, res) => {
        var user = req.session.user
        if(user != null){
            res.status(200).json({user: user})
        }
        else{
            res.status(500).json({message: "No Session Found"})
        }
    }
    
    //destroy session
    destroySession = (req, res) => {
        //destroy session
        req.session.destroy(function(err) {
            res.redirect("/login")
        })
    }
}
module.exports = new homeController;