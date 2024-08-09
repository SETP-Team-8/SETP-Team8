async function submitLoginForm() {
    const username = document.getElementById('Username').value;
    const password = document.getElementById('Password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:3000/api/diners/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier: username, Password: password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorMessage.style.display = 'block';
            errorMessage.textContent = '* ' + (errorData.message || 'Invalid username or password');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirect to profile page
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = '* ' + error.message;
    }
}