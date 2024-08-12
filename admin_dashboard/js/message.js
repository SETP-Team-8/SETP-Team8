function getReservationId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('reservation_id');
}

function sendReply() {
    const replyMessage = document.getElementById('reply-message').value;
    if (replyMessage.trim() === '') {
        alert('Please enter a reply message.');
        return;
    }

    const reservationId = getReservationId();
    
    alert(`Reply sent for reservation ID ${reservationId}: ${replyMessage}`);
    document.getElementById('reply-message').value = ''; 
}