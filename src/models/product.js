const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _barcode: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    importPrice: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    totalQuantity: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Boolean,
        default: false,
    },
    fileName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Product', productSchema);