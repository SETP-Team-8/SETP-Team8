async function submitLoginForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:3000/api/diners/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier: username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorMessage.style.display = 'block';
            errorMessage.textContent = '* ' + (errorData.message || 'Invalid username or password');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'profile.html'; // Ensure 'profile.html' exists or update path accordingly
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = '* ' + error.message;
    }
}