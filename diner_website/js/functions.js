document.addEventListener('DOMContentLoaded', function() {
    updateNav();
});

function updateNav() {
    const token = localStorage.getItem('token');
    if (token) {
        // Decode JWT to read the payload
        const base64Url = token.split('.')[1]; // token is in three parts, header.payload.signature
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64)); // Decoding base64 to string

        // Check if the payload contains the name, and update the UI accordingly
        if(payload.name) {
            document.getElementById('welcomeMessage').textContent = `Welcome, ${payload.name}`;
        } else {
            document.getElementById('welcomeMessage').textContent = `Welcome, User`; // Fallback if name isn't included
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
    window.location.href = 'log-in.html'; // Redirect to login page after logout
}

function searchRestaurants() {
    const searchQuery = document.querySelector('.search').value.trim();
    if (!searchQuery) {
        alert('Please enter a search query.');
        return;
    }
    // Assuming you have an endpoint to handle the search or you'll navigate to a search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchQuery)}`;
}
