document.addEventListener('DOMContentLoaded', function() {
    updateNav(); 
    attachFormEvents(); 
    populateFormDataFromURL(); 
    fetchDinerInfo(); 
});

function fetchDinerInfo() {
    const token = localStorage.getItem('token');
    if (token) {
        const dinerId = parseJwt(token).dinerId; 
        if (dinerId) {
            fetch(`http://localhost:3000/api/diners/${dinerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.querySelector('.title').value = data.Title || 'Mr'; 
                    document.querySelector('.firstname').value = data.FirstName || '';
                    document.querySelector('.lastname').value = data.LastName || '';
                    document.querySelector('.phonenumber').value = data.PhoneNumber || '';
                    document.querySelector('.email').value = data.Email || '';
                }
            })
            .catch(error => console.error('Failed to fetch diner info:', error));
        }
    }
}

function collectFormData() {
    return {
        FirstName: document.querySelector('.firstname').value,
        LastName: document.querySelector('.lastname').value,
        PhoneNumber: document.querySelector('.phonenumber').value,
        Email: document.querySelector('.email').value,
        ReservationDate: document.querySelector('.reservationdate').value,
        ReservationTime: document.querySelector('.reservationtime').value,
        NumberOfGuests: document.querySelector('.numberofguests').value,
    };
}

function populateFormDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    const numberOfGuests = params.get('numberOfGuests');
    const reservationDate = params.get('date');
    const reservationTime = params.get('time');

    if (numberOfGuests) document.querySelector('.numberofguests').value = numberOfGuests;
    if (reservationDate) document.querySelector('.reservationdate').value = reservationDate;
    if (reservationTime) document.querySelector('.reservationtime').value = reservationTime;
}

function updateNav() {
    const navUser = document.getElementById('navUser');
    const navGuest = document.querySelector('.navbtm');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const token = localStorage.getItem('token');

    if (token) {
        const user = parseJwt(token);
        if (user && user.name) {
            welcomeMessage.textContent = `Welcome, ${user.name}`;
            navUser.style.display = 'flex';
            navGuest.style.display = 'none';
        } else {
            console.error('JWT is invalid or does not contain a name');
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
        const decoded = JSON.parse(window.atob(base64));
        return decoded;
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
    const reservationForm = document.querySelector('.inputform');
    reservationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        createReservation();
    });
}

function createReservation() {
    const token = localStorage.getItem('token');
    let dinerID = token ? parseJwt(token).sub : null; 
    const formData = {
        FirstName: document.querySelector('.firstname').value,
        LastName: document.querySelector('.lastname').value,
        PhoneNumber: document.querySelector('.phonenumber').value,
        Email: document.querySelector('.email').value,
        ReservationDate: document.querySelector('.reservationdate').value,
        ReservationTime: document.querySelector('.reservationtime').value,
        NumberOfGuests: document.querySelector('.numberofguests').value,
        DinerID: token ? parseJwt(token).dinerId : null,
        RestaurantID: '1' 
    };

    fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create reservation');
        }
        return response.json();  
    })
    .then(data => {
        if (data.reservationId) {
            console.log('Reservation created successfully:', data);
            
            window.location.href = `confirmation.html?firstName=${encodeURIComponent(formData.FirstName)}&reservationId=${data.reservationId}&date=${encodeURIComponent(formData.ReservationDate)}&time=${encodeURIComponent(formData.ReservationTime)}`;
        } else {
            throw new Error('Reservation ID not found');
        }
    })
    .catch(error => {
        console.error('Error creating reservation:', error);
        alert('An error occurred while creating the reservation.');
    });
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        return decoded;
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    window.location.reload();
}