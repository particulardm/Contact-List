document.addEventListener('DOMContentLoaded', function() {
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginData = {
     username: document.getElementById('username').value,
      password: document.getElementById('password').value
    }

    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        if (response.ok) {
            const token = response.headers.get('Authorization'); 
            localStorage.setItem('token', token);
            alert(token);
        } else {
            alert('Login failed. Please check your credentials and try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    }
});
});