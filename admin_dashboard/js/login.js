document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('/api/staff/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Process the response if it's successful
        }
        throw new Error('Login failed'); // Handle non-2xx responses
    })
.then(data => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userDetails', JSON.stringify({
      restaurantName: data.restaurantName,
      staffName: data.staffName,
      role: data.role
    }));
    window.location.href = '/admin/welcome.html'; // Redirect to the welcome page
  } else {
    throw new Error('Login failed: ' + data.message);
  }
})
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
    });
});