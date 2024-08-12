document.addEventListener('DOMContentLoaded', function() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
        document.querySelector('.welcome-info').innerHTML = `
            <p><strong>Restaurant:</strong> ${userDetails.restaurantName}</p>
            <p><strong>Name:</strong> ${userDetails.staffName}</p>
            <p><strong>Role:</strong> ${userDetails.role}
        `;
    } else {
        console.log('No user details found in local storage.');
    }
});