const express = require('express');
const router = express.Router();

const { getAllContacts, postContact, getSingleContact, deleteSingleContact, updateSingleContact } = require('../controllers/contactController');


router.route('/')
.get(getAllContacts)
.post(postContact);

router.route('/:id')
.get(getSingleContact)
.put(updateSingleContact)
.delete(deleteSingleContact);

module.exports = router;