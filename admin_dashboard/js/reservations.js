document.addEventListener('DOMContentLoaded', function() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.restaurantId) {
        fetchReservationsByRestaurant(userDetails.restaurantId);
    } else {
        console.error('Restaurant ID not found in local storage');
    }
});

function fetchReservationsByRestaurant(restaurantId) {
    fetch(`http://localhost:3000/api/reservations?restaurantId=${restaurantId}`)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('reservation-table-body');
        tableBody.innerHTML = ''; 
        data.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.ReservationID}</td>
                <td>${reservation.FirstName || ''}</td>
                <td>${new Date(reservation.ReservationDate).toLocaleDateString()}</td>
                <td>${new Date('1970-01-01T' + reservation.ReservationTime + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                <td>${reservation.TableID || ''}</td>
                <td>${reservation.NumberOfGuests || ''}</td>
                <td>${reservation.Status || ''}</td>
                <td>${reservation.PhoneNumber || ''}</td>
                <td>${reservation.Email || ''}</td>
                <td>
                    <button class="edit-btn" onclick="editRow(this)">Edit</button>
                    <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching reservations:', error);
        alert('Failed to load reservations.');
    });
}

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatTime(time) {
    const t = new Date('1970-01-01T' + time + 'Z');
    let hours = t.getUTCHours().toString(),
        minutes = t.getUTCMinutes().toString();

    if (hours.length < 2)
        hours = '0' + hours;
    if (minutes.length < 2)
        minutes = '0' + minutes;

    return `${hours}:${minutes}`;
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');
    cells.forEach((cell, index) => {
        if (index === 0 || index === 5 || index === 9) return;  

        if (index === 6) {  
            const selectElement = document.createElement('select');
            const options = [
                { value: 'confirmed', text: 'Confirmed' },
                { value: 'canceled', text: 'Cancelled' },
                { value: 'completed', text: 'Completed' }
            ];
            options.forEach(optionData => {
                const option = document.createElement('option');
                option.value = optionData.value;
                option.text = optionData.text;
                if (optionData.text.toLowerCase() === cell.innerText.trim().toLowerCase()) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            });
            cell.innerHTML = '';
            cell.appendChild(selectElement);
        } else {
            const inputType = (index === 2 || index === 3) ? 'date' : 'text'; 
            const input = document.createElement('input');
            input.type = inputType;
            input.value = (inputType === 'date' && cell.innerText) ? formatDate(cell.innerText) : cell.innerText;
            if (inputType === 'date' && index === 3) {  
                input.type = 'time';
                input.value = formatTime(cell.innerText);
            }
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });

    row.querySelector('.edit-btn').style.display = 'none';
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');
    saveBtn.onclick = () => saveChanges(saveBtn);
    row.appendChild(saveBtn);
}

function saveChanges(button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input, select');  
    inputs.forEach(input => {
        const cell = input.parentElement;
        cell.innerText = input.value;  
    });
    button.remove();
    row.querySelector('.edit-btn').style.display = 'inline';
}

function deleteRow(button) {
    
    if (confirm('Are you sure you want to delete this reservation?')) {
        const row = button.closest('tr');
        row.remove();
    }
}

function toggleForm() {
    const form = document.getElementById('add-reservation-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function createReservation(event) {
    event.preventDefault();
    const name = document.getElementById('res-name').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value; 
    const table = document.getElementById('res-table').value;
    const persons = document.getElementById('res-persons').value;
    const status = document.getElementById('res-status').value;
    const phone = document.getElementById('res-phone').value;
    const email = document.getElementById('res-email').value;

    const tableBody = document.getElementById('reservation-table-body');
    const newRow = document.createElement('tr');
    const reservationIdCounter = Date.now(); 

    newRow.innerHTML = `
        <td>${reservationIdCounter}</td>
        <td>${name}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>${table}</td>
        <td>${persons}</td>
        <td>${status}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="save-btn" style="display:none;" onclick="saveChanges(this)">Save</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    document.getElementById('add-reservation-form').reset();
    toggleForm(); 
}