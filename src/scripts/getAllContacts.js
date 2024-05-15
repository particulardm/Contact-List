document.addEventListener('DOMContentLoaded', function() {
    const getAllContactsButton = document.getElementById('getAllContacts');

    getAllContactsButton.addEventListener('click', async function() {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('api/contacts', {
                method: 'GET',
                headers: {
                'Authorization': token
            },
        });
            if (!response.ok) {
                const errorData = await response.json();
                contactsList.innerHTML = `<p>${errorData.message}</p>`;
                throw new Error(errorData.message);
            }
            const contactsObject = await response.json();
            let contactsHtml = '';

            contactsObject.contacts.forEach(contact => {
                contactsHtml += `<li>${contact.name} - ${contact.email}</li>`;
                });

            contactsList.innerHTML = contactsHtml;
        } catch(err) {
            console.error("Error fetching contacts:", err);
        };
    });

    const addNewContactForm = document.getElementById('addContact');
    addNewContactForm.addEventListener('submit', async function() {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const newContact = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value
        };

        try {
            const response = await fetch('api/contacts', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(newContact)
        });
            if (!response.ok) throw new Error('Cannot create a new contact', response.error);

            alert('Contact added!!');
            addNewContactForm.reset();
        } catch(err) {
            console.error("Error creating a contact:", err);
        }
    });

    const getContactByIdButton = document.getElementById('getContactById');
    getContactByIdButton.addEventListener('click', async function() {
        const contactId = document.getElementById('getContactId').value;
        
        try {
            const response = await fetch(`/api/contacts/${contactId}`);
            if (!response.ok) {
                const errorData = await response.json();
                contactsList.innerHTML = `<p>${errorData.message}</p>`;
                throw new Error(errorData.message);
            }
            
            const contactsObject = await response.json();
            contactsList.innerHTML = `<p>Contact found: ${contactsObject.contact.name} - ${contactsObject.contact.email}</p>`;
        } catch (err) {
            console.error('Error fetching contact by ID:', err);
        }
    });

    const deleteContactByIdButton = document.getElementById('deleteContactById');
    deleteContactByIdButton.addEventListener('click', async function() {
        const contactId = document.getElementById('deleteContactId').value;
        
        try {
            const response = await fetch(`/api/contacts/${contactId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
            }
        });
            if (!response.ok) {
                const errorData = await response.json();
                contactsList.innerHTML = `<p>${errorData.message}</p>`;
                throw new Error(errorData.message);
            }
            
            const contactsObject = await response.json();
            contactsList.innerHTML = `<p>Contact deleted: ${contactsObject.contact.name} - ${contactsObject.contact.email}</p>`;
        } catch (err) {
            console.error('Error deleting contact by ID:', err);
        }
    });
});