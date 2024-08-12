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
            return response.json(); 
        }
        throw new Error('Login failed'); 
    })
.then(data => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userDetails', JSON.stringify({
      restaurantName: data.restaurantName,
      staffName: data.staffName,
      role: data.role,
      restaurantId: data.restaurantId
    }));
    window.location.href = '/admin/welcome.html'; // to welcome page
  } else {
    throw new Error('Login failed: ' + data.message);
  }
})
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
    });
});