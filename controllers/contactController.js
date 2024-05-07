const Contact = require('../models/contactModel');


// all the routes below are private:
const getAllContacts = async function(req, res) {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ message: "The following contacts exist in a database atm:", contacts });
    } catch(err) {
        console.error("Couldn't get the contacts", err);
        return res.status(400).json({ message: "Couldn't get the contacts", err });
    } 
}

const postContact = async function(req, res) {
    const { name, email, phone } = req.body;

    if (!name || !(email || phone)) {
        return res.status(400).json( { message: "Please specify a name and either email or phone, or both!!"} );
    }

    try {
        const contact = await Contact.create( { name, email, phone });
        res.status(200).json({ message: "Contact posted", contact });
    } catch(err) {
        console.error(err, "Couldn't post a contact");
        return res.status(400).json({ message: "Couldn't post a contact", err });
    } 
}

const getSingleContact = async function(req, res) {
    const _id = req.params.id;

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        const contact = await Contact.findById(_id);
        res.status(200).json({ message: "Contact found", contact });
    } catch(err) {
        console.error("Couldn't find a contact by id", err);
        return res.status(400).json({  message: "Couldn't find a contact by id", err });
    } 
}

const deleteSingleContact = async function(req, res) {
    const _id = req.params.id;

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        const contact = await Contact.findByIdAndDelete( _id );
        res.status(200).json({ message: "Contact deleted", contact });
    } catch(err) {
        console.error("Couldn't delete a contact by id", err);
        return res.status(400).json({ message: "Couldn't delete a contact by id", err });
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
        const contact = await Contact.findOneAndUpdate( {_id}, { name, email, phone } );
        res.status(200).json({ message: "Contact updated", contact });
    } catch(err) {
        console.error("Couldn't update a contact by id", err);
        return res.status(400).json({ message: "Couldn't update a contact by id", err });
    } 
}

module.exports = { getAllContacts, postContact, getSingleContact, deleteSingleContact, updateSingleContact };