const employeeService = require('../services/employeeService.js')
const Employee = require('../models/employee.js');

class employeeController {
    //[GET] employees                                       
    getEmployee = async (req, res) => {
        try {
            let result = await employeeService.findAllEmployees();
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    employees: result.employees 
                });
            }
            else{
                res.status(400).json({ message: orders.error});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    };

    //[POST] api/employees
    postEmployee = async (req, res) => {
        try {
            let result = await employeeService.addEmployee(req.body.fullname, req.body.profileImg, req.body.phoneNumber, req.body.address, req.body.gmail);
            if(result.status=='success'){
                res.status(201).json({ 
                    message: 'Success', 
                    employee: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.error});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    };

    // [GET] api/employees/:id
    getEmployeeById = async (req, res) => {
        try {
            const id = req.params.id; 
            let result = await employeeService.findEmployeeById(id);
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    employee: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }

    }
  
    // [PUT] api/employees/:id
    updateEmployeeById = async (req, res) => {
        try {
            const id = req.params.id;
            const updateData = req.body;
            let result = await employeeService.updateEmployee(id, updateData);
            if(result.status=='success'){
                res.status(200).json({ 
                    message: 'Success', 
                    employee: result.message 
                });
            }
            else{
                res.status(400).json({ message: result.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }
  
    // [DELETE] api/employees/:id
    deleteEmployeeById = async (req, res) => {
        try {
            const id = req.params.id;
            let result = await employeeService.deleteEmployee(id);
            if(result.status=='success'){
                res.status(200).json({ 
                    message: result.message
                });
            }
            else{
                res.status(400).json({ message: result.message});
            }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error });
        }
    }
}
module.exports = new employeeController;