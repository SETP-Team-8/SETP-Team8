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
    const bookingBy = document.getElementById('res-booking-by').value;
    const phone = document.getElementById('res-phone').value;
    const email = document.getElementById('res-email').value;

    const tableBody = document.getElementById('reservation-table-body');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${reservationIdCounter++}</td>
        <td>${name}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>${table}</td>
        <td>${persons}</td>
        <td>${status}</td>
        <td>${bookingBy}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td><a href="inbox.html">Inbox</a></td>
        <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="save-btn" style="display:none;" onclick="saveChanges(this)">Save</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    document.getElementById('add-reservation-form').reset();
    toggleForm(); // Hide the form after submission
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');

    cells.forEach((cell, index) => {
        if (!cell.classList.contains('non-editable')) {
            const input = document.createElement('input');
            input.type = index === 2 || index === 3 ? 'date' : 'text';
            input.value = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });

    button.style.display = 'none';
    button.nextElementSibling.style.display = 'inline-block';
}

function saveChanges(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');

    cells.forEach(cell => {
        const input = cell.querySelector('input');
        if (input) {
            cell.innerText = input.value;
        }
    });

    button.style.display = 'none';
    button.previousElementSibling.style.display = 'inline-block';
}

function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
}