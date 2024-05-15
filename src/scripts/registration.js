document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registerForm');
        registrationForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const newUser = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch('user/register', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
                if (!response.ok) throw new Error('Cannot create a new user', response.error);
                alert('User added!!');
                registrationForm.reset();
            } catch(err) {
                console.error("Error creating a new user:", err);
            }
        });
});