document.addEventListener('DOMContentLoaded', function() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
        document.getElementById('restaurantName').textContent = userDetails.restaurantName;
        document.getElementById('staffName').textContent = userDetails.staffName;
        document.getElementById('role').textContent = userDetails.role;

        const reservationsLink = document.querySelector('a[href="reservations.html"]');
        reservationsLink.href = `reservations.html?restaurantId=${userDetails.restaurantId}`;
    } else {
        console.log('No user details found in local storage.');
    }
});