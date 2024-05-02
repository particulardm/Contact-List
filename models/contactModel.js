const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    }
});

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;

