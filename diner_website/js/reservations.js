document.addEventListener('DOMContentLoaded', function() {
    updateNav(); // Check user status and update navigation accordingly
    attachFormEvents();
});

function updateNav() {
    const navUser = document.getElementById('navUser');
    const navGuest = document.querySelector('.navbtm'); // Assuming navGuest is the guest user navigation container
    const welcomeMessage = document.getElementById('welcomeMessage');
    const bookNowBtn = document.querySelector('.booknowbtn');
    const signUpBtn = document.querySelector('.signupbtn');

    const token = localStorage.getItem('token');
    if (token) {
        const user = parseJwt(token);
        if (user && user.name) {
            welcomeMessage.textContent = `Welcome, ${user.name}`;
            navUser.style.display = 'flex'; // Show user specific navigation
            navGuest.style.display = 'none'; // Hide guest navigation
            bookNowBtn.style.display = 'block'; // Show only book now button
            signUpBtn.style.display = 'none'; // Hide signup button
        } else {
            console.error('JWT is invalid or does not contain a name');
        }
    } else {
        navUser.style.display = 'none'; // Hide user specific navigation
        navGuest.style.display = 'flex'; // Show guest navigation
        bookNowBtn.style.display = 'block'; // Ensure book now is visible for guests
        signUpBtn.style.display = 'block'; // Show signup button for guests
    }
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = window.atob(base64);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    window.location.reload();
}

function attachFormEvents() {
    const bookNowBtn = document.querySelector('.booknowbtn');
    const signUpBtn = document.querySelector('.signupbtn');

    bookNowBtn.addEventListener('click', () => {
        const firstName = document.querySelector('.firstname').value;
        const lastName = document.querySelector('.lastname').value;
        const phone = document.querySelector('.phonenumber').value;
        const email = document.querySelector('.email').value;

        console.log(`Booking details: ${firstName} ${lastName}, Phone: ${phone}, Email: ${email}`);
        // Here you would typically implement an API call or form submission logic
    });

    signUpBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
    });
}
