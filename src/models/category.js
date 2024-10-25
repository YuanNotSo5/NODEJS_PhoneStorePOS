const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true,
    },
    exists: {
        type: Boolean,
        default: false,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Category', categorySchema);