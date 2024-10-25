const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true,
    },
    products: [
        {
            barcode: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    receivedMoney: {
        type: Number,
        required: true,
    },
    changes: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    idEmp: {
        type: String,
        ref: 'Employee',
        required: true,
    },
    idCus: {
        type: String,
        ref: 'Customer',
        required: true,
    },
    revenue: {
        type: Number,
        required: true,
    }
})
module.exports = mongoose.model('Invoice', invoiceSchema)
