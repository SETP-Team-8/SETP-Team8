document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userData = {
        Title: document.querySelector('select[name="gender"]').value,
        FirstName: document.querySelector('.firstname').value,
        LastName: document.querySelector('.lastname').value,
        PhoneNumber: document.querySelector('.phonenumber').value,
        DateOfBirth: document.querySelector('.date').value,
        Email: document.querySelector('.email').value,
        Password: document.querySelector('.password').value,
        ConfirmPassword: document.querySelector('.confirmpassword').value
    };

    fetch('http://localhost:3000/api/diners/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'index.html'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message); 
    });
});