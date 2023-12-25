
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const nodemailer = require('nodemailer')
const {OAuth2Client} = require("google-auth-library")
const hbs = require('nodemailer-express-handlebars')
const jwt = require('jsonwebtoken');

const accountService = require('../services/accountService.js')
const employeeService = require('../services/employeeService.js');

class adminController {

    //[GET]/Admin
    // getAdmin = (req,res) => {
    //     res.render("admin/index")
    // }
    //[POST]/login
    getAllAccount = async (req, res) => {
        try {
            var employees = await employeeService.findAllEmployees()
            var list_employee = employees.employees

            var list_account = []
            var list_img = []
            for(var i = 0; i < list_employee.length; i++){
                var temp = []
                let result = await accountService.findAccountByEmail(list_employee[i].gmail);
                if(result.status=='success'){
                    var account = result.message
                    list_img.push(list_employee[i].profileImg)
                    temp.push(account._id)
                    temp.push(account.username)
                    temp.push(account.isLocked)
                    temp.push(account.isActived)
                    temp.push(account.gmail)

                    list_account.push(temp)
                }
            }
            res.render("admin/account", {accounts: list_account, imgs: list_img})
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    //[POST]/login
    getAccountInfo = async (req, res) => {
        try {
            var id = req.params.id
            var result = await accountService.findAccountById(id)
            var account = result.message

            let employee = await employeeService.findEmployeeByEmail(account.gmail);

            res.status(200).json({employee: employee.message, account: account})
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    //[POST]/register
    createEmployee  = async (req,res) => {
        try {
            var email = req.body.email
            var password = email.split("@")[0]

            let employee = await employeeService.addEmployee(req.body.fullname, "/images/avatar/avatar.jpg", req.body.phoneNumber, req.body.address, email)

            if(employee.status =="success"){
                let result = await accountService.addAccount(email, req.body.fullname, password);
                
                if(result.status=="success"){
                    res.json({
                        status: 'success',
                        employee: employee.message,
                        account: result.message
                    });
                }
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

    //[POST]/register
    deleteEmployee  = async (req,res) => {
        try {
            var id = req.params.id

            let account = await accountService.findAccountById(id)

            let result_empl = await employeeService.deleteEmployee(account.message.gmail)

            if(result_empl.status == "success"){
                let result_acc = await accountService.deleteAccount(id)
                if(result_acc.status == "success"){
                    res.json({
                        status: 'success',
                        message: "Xóa nhân viên thành công"
                    });
                }else{
                    res.json({
                        status: 'fail',
                        message: result_acc.message,
                    });
                }
            }
            else{
                res.json({
                    status: 'fail',
                    message: result_empl.message
                });
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }

    updateEmployee  = async (req,res) => {
        try {
            var id = req.params.id
            var updatedAccountData = {
                gmail: req.body.email,
                username: req.body.username,
            }
            var oldEmail = req.body.oldEmail
            let updateAccount = await accountService.updateAccount(id, updatedAccountData)
            
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
    

    lockEmployee  = async (req,res) => {
        try {
            var id = req.params.id

            let account = await accountService.findAccountById(id)

            let updateAccount = account.message

            let data
            if(updateAccount.isLocked)
                data = {isLocked: false}
            else{
                data = {isLocked: true}
            }
            let result = await accountService.updateAccount(id, data)
            
            if(result.status == "success"){
                res.json({
                    status: 'success',
                    message: "Khóa/Mở khóa nhân viên thành công"
                });
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

    getAccessToken = async () =>{
        const oAuth2 = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
        )
        
        oAuth2.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        })
        const accessToken = await oAuth2.getAccessToken();
        return accessToken.token
    }

    sendEmail = async(req,res) =>{
        try{
            const result = await this.sendEmailFunct(req.body.email)
            if(result){
                res.status(200).json({message: "An email has sent to you gmail"})
            }
            else{
                res.status(500).json({message: result})
            }
            
        }
        catch(error){
            console.log(error)
            res.status(500).json({error: error.message})
        }
    }

    sendEmailFunct = async (email) =>{
        try{
            const accessToken = await this.getAccessToken()

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    type: 'OAuth2',
                    user: process.env.ADMIN_EMAIL,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })

            const handlebarOptions = {
                viewEngine: {
                    partialsDir: './src/views/admin',
                    defaultLayout: false,
                },
                viewPath: './src/views/admin',
            };
            var token = jwt.sign({
                email:  email
            },process.env.KEY, {expiresIn: "60s"});
    
            const mailOptions = {
                from: "ADMIN",
                to: email,
                template: "email",
                subject: "[NODEJS_CK] Activate Your Account",
                context: {
                    email: email,
                    token: token + "/" + email
                },
            }
            transport.use("compile",hbs(handlebarOptions))
            await transport.sendMail(mailOptions)

            return true
        }
        catch(error){
            console.log(error)
            return error
        }
    }

    resendEmail = async (req,res) => {
        const email = req.params.email
        try{
            const result = await this.sendEmailFunct(email)
            res.redirect("/login")
        }
        catch(error){
            console.log(error)
            res.status(500).json({error: error.message})
        }
    }
    mailTrack = async(req,res) => {
        console.log(req.params)
        
        const token = req.params.token
        const email = req.params.email
        if(token != null && email != null){
            try {
                jwt.verify(token, process.env.KEY, function(err, decoded){
                    if(err){
                        res.status(400).json("Token has expired")
                    }
                })
                var result = await accountService.activateAccount(email)
                if(result.status == "fail")
                res.status(400).json({message: result.message})
                else{
                    res.redirect("/login")
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({message: error})
            }
        }else{
            res.status(500)
        }
    }
}
module.exports = new adminController;