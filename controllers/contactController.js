const Contact = require('../models/contactModel');
const User = require('../models/userModel');
const crypto = require('node:crypto');

const ETags = new Set();


// all the routes below are private:
const getAllContacts = async function(req, res) {
    const userId = req.user.id;
    const ETag = req.headers['if-none-match'];

    if (ETags.has(ETag)) {
        return res.status(304).end();
    }
    
    try {
        const contacts = await User
            .findOne({ _id: userId})
            .populate('contacts');

        const generatedETag = crypto.createHash('md5').update(JSON.stringify(contacts)).digest('hex');
        ETags.add(generatedETag);

        res.setHeader('ETag', generatedETag);
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "The following contacts associated with your profile in a database atm:", contacts: contacts.contacts });
    } catch(err) {
        console.error("Couldn't get the contacts", err);
        return res.status(400).json({ message: "Couldn't get the contacts", err });
    } 
}

const postContact = async function(req, res) {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    if (!name || !(email || phone)) {
        return res.status(400).json( { message: "Please specify a name and either email or phone, or both!!"} );
    }

    try {
        const contact = await Contact.create( { name, email, phone });
        await User.findOneAndUpdate( 
            { _id: userId }, 
            { $push: { contacts: contact._id }}, 
            { new: true }
        );

        const ETagToDelete = req.headers['etagtodelete'];
        ETags.delete(ETagToDelete);
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
    const userId = req.user.id;

    if (!_id) {
        return res.status(400).json( { message: "Please fill in the id required!!"} );
    }

    try {
        const contact = await Contact.findByIdAndDelete( _id );
        await User.findOneAndUpdate(
            { _id: userId }, 
            { $pull: { contacts: _id} }, 
            { new: true }
        )

        const ETagToDelete = req.headers['etagtodelete'];
        ETags.delete(ETagToDelete);
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