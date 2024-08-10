document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const firstName = params.get('firstName');
    const reservationId = params.get('reservationId');
    const date = params.get('date');
    const time = params.get('time');

    document.getElementById('firstName').textContent = firstName || 'Not specified';
    document.getElementById('reservationId').textContent = reservationId || 'Not specified';
    document.getElementById('date').textContent = date || 'Not specified';
    document.getElementById('time').textContent = time || 'Not specified';
});

function logoutUser() {
    localStorage.removeItem('token');
    window.location.href = 'index.html'; // Redirect to home on logout
}