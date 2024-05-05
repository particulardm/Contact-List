const mongoose = require('mongoose');
const Contact = require('../models/contactModel');

const uri = process.env.URI;

// all the routes below are private:
const getAllContacts = async function(req, res) {
    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contacts = await Contact.find();
        res.status(200).json({ message: "the following contacts exist in a database atm:", contacts });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const postContact = async function(req, res) {
    const { name, email, phone } = req.body;

    if (!name || !(email || phone)) {
        return res.status(400).json( { message: "Please specify a name and either email or phone, or both!!"} );
    }

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.create( { name, email, phone });
        res.status(200).json({ message: "contact posted", contact });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const getSingleContact = async function(req, res) {
    const _id = req.params.id;

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findById(_id);
        res.status(200).json({ message: "contact found", contact });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const deleteSingleContact = async function(req, res) {
    const _id = req.params.id;

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findByIdAndDelete( _id );
        res.status(200).json({ message: "contact deleted", contact });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const updateSingleContact = async function(req, res) {
    const { name, email, phone } = req.body;
    const _id = req.params.id;

    if (!(name || email || phone)) {
        return res.status(400).json( { message: "Please specify the field you are going to update!!"} );
    }

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const contact = await Contact.findOneAndUpdate( {_id}, { name, email, phone } );
        res.status(200).json({ message: "contact replaced", contact });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

module.exports = { getAllContacts, postContact, getSingleContact, deleteSingleContact, updateSingleContact };