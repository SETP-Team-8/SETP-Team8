document.getElementById('create-user-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;

    const tbody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');

    const userId = tbody.rows.length + 1;

    newRow.innerHTML = `
        <td>${userId}</td>
        <td>${username}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${dob}</td>
        <td>${password}</td>
        <td>
            <button onclick="editUser(this)">Edit</button> 
            <button onclick="deleteUser(this)">Delete</button>
        </td>
    `;

    tbody.appendChild(newRow);

    document.getElementById('create-user-form').reset();
});

function editUser(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
        cell.contentEditable = true;
    });

    button.textContent = 'Save';
    button.onclick = function() {
        saveUser(button);
    };
}

function saveUser(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
        cell.contentEditable = false;
    });

    button.textContent = 'Edit';
    button.onclick = function() {
        editUser(button);
    };
}

function deleteUser(button) {
    const row = button.closest('tr');
    row.remove();
}