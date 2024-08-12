document.addEventListener('DOMContentLoaded', function() {
    updateNav();
    fetchRestaurants(); 
});

function updateNav() {
    const token = localStorage.getItem('token');
    if (token) {
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        if (payload.name) {
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

function searchRestaurants() {
    const searchQuery = document.querySelector('.search').value.trim();
    if (!searchQuery) {
        alert('Please enter a search query.');
        return;
    }
    window.location.href = `search-results.html?query=${encodeURIComponent(searchQuery)}`;
}

function fetchRestaurants() {
    fetch('http://localhost:3000/api/restaurants/')
    .then(response => response.json())
    .then(restaurants => {
        const newAndHotContainer = document.getElementById('newAndHotRestaurants');
        const dealOfTheWeekContainer = document.getElementById('dealOfTheWeekRestaurants');
        
        newAndHotContainer.innerHTML = '';
        dealOfTheWeekContainer.innerHTML = '';
        
        restaurants.slice(0, 8).forEach((restaurant, index) => {
            const restaurantElement = createRestaurantCard(restaurant);
            if (index < 4) {
                newAndHotContainer.appendChild(restaurantElement);
            } else {
                dealOfTheWeekContainer.appendChild(restaurantElement);
            }
        });
    })
    .catch(error => console.error('Failed to fetch restaurants:', error));
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('a');
    card.href = `restaurant-page.html?id=${restaurant.RestaurantID}`;
    card.classList.add('cad');
    let imagePath = restaurant.ImagePath || 'images/default.png'; 

    
    if (imagePath.startsWith('/')) {
        imagePath = imagePath.slice(1); 
    }
    if (!imagePath.startsWith('images/')) {
        imagePath = `images/${imagePath}`; 
    }

    card.innerHTML = `
        <div class="cadimg">
            <img src="${imagePath}" alt="${restaurant.Name}" onerror="this.onerror=null; this.src='images/default.png';">
        </div>
        <div class="cadcaption">
            <p class="restaurantcaption">${restaurant.Name}</p>
            <p class="rating"><i class="fas fa-star"></i> ${restaurant.Rating || 'N/A'}</p>
        </div>
    `;
    return card;
}