const mainImage = document.getElementById('mainImage');
const subImages = document.querySelectorAll('.subimage img');

if (!mainImage) {
    console.error('Main image element not found');
}

subImages.forEach((subImage) => {
    subImage.addEventListener('click', () => {
        if (mainImage && subImage.src) {
            mainImage.src = subImage.src;
            subImages.forEach(img => img.classList.remove('active'));
            subImage.classList.add('active');
        } else {
            console.error('Error updating the main image source');
        }
    });
});

function preloadImages() {
    subImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

function updateNav() {
    const navUser = document.getElementById('navUser');
    const navGuest = document.querySelector('.navbtm');
    const welcomeMessage = document.getElementById('welcomeMessage');

    const token = localStorage.getItem('token');
    if (token) {
        const user = parseJwt(token);
        if (user) {
            welcomeMessage.textContent = `Welcome, ${user.name || 'User'}`;
            navUser.style.display = 'flex';
            navGuest.style.display = 'none';
        } else {
            console.error('JWT is invalid');
        }
    } else {
        navUser.style.display = 'none';
        navGuest.style.display = 'flex';
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

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');

    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the form from submitting via HTTP

        const numberOfGuests = document.querySelector('.numberofguests').value;  // Retrieve the number of guests
        const reservationDate = document.querySelector('.reservationdate').value; // Retrieve the reservation date
        const reservationTime = document.querySelector('.reservationtime').value; // Retrieve the reservation time

        const selectedDate = new Date(reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Normalize today's date

        // Check if the date is set and valid
        if (!reservationDate || selectedDate < today) {
            alert("Please select a date that is today or in the future.");
            return;  // Stop execution if date is not valid
        }

        // Redirect to the reservations page with parameters
        window.location.href = `reservations.html?numberOfGuests=${numberOfGuests}&date=${reservationDate}&time=${reservationTime}`;
    });

    preloadImages();
    updateNav();
});