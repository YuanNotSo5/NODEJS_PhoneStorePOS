const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    _phone: {
        type: String,
        unique: true,
        required: true,
        ref: 'Invoice',
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Customer', customerSchema)