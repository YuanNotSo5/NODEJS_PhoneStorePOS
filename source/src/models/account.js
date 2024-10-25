const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    gmail: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    hash_password: {
        type: String,
        require: true,
    },
    isLocked: {
        type: Boolean, 
        default: false,
    },
    isActived: {
        type: Boolean,
        default: false,
    },
    authorization: {
        type: Number,
        default: false,
    }
})

module.exports = mongoose.model('Account', accountSchema)