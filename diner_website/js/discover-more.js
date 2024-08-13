document.addEventListener('DOMContentLoaded', function() {
    updateNav();
    fetchAllRestaurants(); 
});

function updateNav() {
    const token = localStorage.getItem('token');
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        if(payload.name) {
            document.getElementById('welcomeMessage').textContent = `Welcome, ${payload.name}`;
        } else {
            document.getElementById('welcomeMessage').textContent = `Welcome, User`;
        }
        document.getElementById('navUser').style.display = 'flex';
        document.getElementById('navGuest').style.display = 'none';
    } else {
        document.getElementById('navUser').style.display = 'none';
        document.getElementById('navGuest').style.display = 'flex';
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    updateNav();
    window.location.href = 'log-in.html';
}

function fetchAllRestaurants() {
    const apiUrl = window.location.hostname.includes('localhost') ?'http://localhost:3000' : 'https://setp-team8-8e10177b25fe.herokuapp.com';
    fetch(`${apiUrl}/api/restaurants/`)
    .then(response => response.json())
    .then(restaurants => {
        const container = document.querySelector('.cadcontainer');
        container.innerHTML = ''; 
        restaurants.forEach(restaurant => {
            const restaurantElement = createRestaurantCard(restaurant);
            container.appendChild(restaurantElement);
        });
    })
    .catch(error => console.error('Failed to fetch restaurants:', error));
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('a');
    card.href = `restaurant-page.html?id=${restaurant.RestaurantID}`;
    card.classList.add('cad');
    card.innerHTML = `
        <div class="cadimg">
            <img src="${restaurant.ImagePath || 'images/default.png'}" alt="${restaurant.Name}">
        </div>
        <div class="cadcaption">
            <p class="restaurantcaption">${restaurant.Name}</p>
            <p class="rating"><i class="fas fa-star"></i> ${restaurant.Rating || 'N/A'}</p>
        </div>
    `;
    return card;
}