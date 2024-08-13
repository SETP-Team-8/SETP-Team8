document.addEventListener('DOMContentLoaded', function() {
    setupBookingForm();
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get('id'); 

    const apiUrl = window.location.hostname.includes('localhost') ?
                   'http://localhost:3000' : 'https://setp-team8-8e10177b25fe.herokuapp.com';

    fetch(`${apiUrl}/api/restaurants/${restaurantId}`)
    .then(response => response.json())
    .then(restaurant => {
        document.getElementById('restaurantName').textContent = restaurant.Name;
        document.getElementById('mainImage').src = restaurant.ImagePath || 'images/placeholder-image.jpg';
        document.getElementById('addressDetails').textContent = restaurant.Address;
        document.getElementById('cuisineType').textContent = restaurant.CuisineType;
        document.getElementById('operatingHours').innerHTML = `
            <div class="day"><span>Monday:</span><span>${restaurant.OpeningHours}</span></div>
            <div class="day"><span>Tuesday:</span><span>${restaurant.OpeningHours}</span></div>
            <div class="day"><span>Wednesday:</span><span>${restaurant.OpeningHours}</span></div>
            <div class="day"><span>Thursday:</span><span>${restaurant.OpeningHours}</span></div>
            <div the="day"><span>Friday:</span><span>${restaurant.OpeningHours}</span></div>
            <div the="day"><span>Saturday:</span><span>${restaurant.OpeningHours}</span></div>
            <div the="day"><span>Sunday:</span><span>${restaurant.OpeningHours}</span></div>
        `;
    })
    .catch(error => {
        console.error('Failed to fetch restaurant details:', error);
    });

    updateNav();
    setupImageSwitching();
    setupBookingForm();
});

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

function setupImageSwitching() {
    const mainImage = document.getElementById('mainImage');
    const subImages = document.querySelectorAll('.subimage img');

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

    preloadImages(subImages);
}

function preloadImages(images) {
    images.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) {
        console.error('Booking form not found');
        return;
    }

    
    const urlParams = new URLSearchParams(window.location.search);
    const numberOfGuests = urlParams.get('numberOfGuests');
    const date = urlParams.get('date');
    const time = urlParams.get('time');

    
    const guestsSelect = document.querySelector('.numberofguests');
    const dateInput = document.querySelector('.reservationdate');
    const timeSelect = document.querySelector('.reservationtime');

    if (guestsSelect && numberOfGuests) {
        guestsSelect.value = numberOfGuests;
    }

    if (dateInput && date) {
        dateInput.value = date;
    }

    if (timeSelect && time) {
        timeSelect.value = time;
    }

    
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();  
        
        if (!guestsSelect.value || !dateInput.value || !timeSelect.value) {
            console.error('Form fields are missing');
            return;
        }

        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Please select a date that is today or in the future.");
            return;
        }

        
        window.location.href = `reservations.html?numberOfGuests=${guestsSelect.value}&date=${dateInput.value}&time=${timeSelect.value}`;
    });
}