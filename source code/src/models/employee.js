const mongoose = require('mongoose');
// const Account = require('./account');

const employeeSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    gmail: {
        type: String,
        required: true,
        ref: 'Account',
    },
})

module.exports = mongoose.model('Employee', employeeSchema)