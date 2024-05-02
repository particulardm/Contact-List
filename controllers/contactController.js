const mongoose = require('mongoose');
const Contact = require('../models/contactModel');

const uri = process.env.URI;


const getAllContacts = async function(req, res) {
    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contacts = await Contact.find();
        res.json(contacts);
        console.log(contacts);
    } catch(err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const postContact = async function(req, res) {
    const { name, email, phone } = req.body;

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.create( { name, email, phone });
        res.json(contact);
        console.log(contact);
    } catch(err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const getSingleContact = async function(req, res) {
    const _id = req.params.id;

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findById(_id);
        res.json(contact);
        console.log(contact);
    } catch(err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const deleteSingleContact = async function(req, res) {
    const _id = req.params.id;

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findByIdAndDelete( _id );
        res.json({ message: "contact deleted", contact });
        console.log(contact);
    } catch(err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const updateSingleContact = async function(req, res) {
    const { name, email, phone } = req.body;
    const _id = req.params.id;

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findOneAndReplace( {_id}, { name, email, phone } );
        res.json({ message: "contact replaced", contact });
        console.log(contact);
    } catch(err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

module.exports = { getAllContacts, postContact, getSingleContact, deleteSingleContact, updateSingleContact };