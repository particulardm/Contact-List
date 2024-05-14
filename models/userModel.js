const mongoose = require('mongoose');
const contactModel = require('./contactModel');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contacts: [{ 
        type: mongoose.Types.ObjectId,
        ref: contactModel
    }]
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;