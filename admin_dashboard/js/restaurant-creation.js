document.getElementById('create-restaurant-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const restaurantName = document.getElementById('restaurant-name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const openingHours = compileOpeningHours();
    const cuisineType = document.getElementById('cuisine-type').value;

    const tbody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');
    const restaurantId = tbody.rows.length + 1;

    newRow.innerHTML = `
        <td>${restaurantId}</td>
        <td>${restaurantName}</td>
        <td>${address}</td>
        <td>${phone}</td>
        <td>${openingHours}</td>
        <td>${cuisineType}</td>
        <td>
            <button onclick="editRestaurant(this)">Edit</button>
            <button onclick="deleteRestaurant(this)">Delete</button>
        </td>
    `;

    tbody.appendChild(newRow);
    document.getElementById('create-restaurant-form').reset();
});

function compileOpeningHours() {
    let hours = '';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
        const open = document.getElementById(`${day.toLowerCase()}-opening`).value;
        const close = document.getElementById(`${day.toLowerCase()}-closing`).value;
        hours += `${day}: ${open} - ${close}\n`;
    });
    return hours;
}

function editRestaurant(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
        if (cell !== cells[0] && cell !== cells[6]) { 
            cell.contentEditable = true;
        }
    });

    button.textContent = 'Save';
    button.onclick = function() {
        saveRestaurant(button);
    };
}

function saveRestaurant(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
        cell.contentEditable = false;
    });

    button.textContent = 'Edit';
    button.onclick = function() {
        editRestaurant(button);
    };
}

function deleteRestaurant(button) {
    const row = button.closest('tr');
    row.remove();
}