let staffIdCounter = 1;

function createStaffAccount(event) {
    event.preventDefault();
    const name = document.getElementById('staff-name').value;
    const email = document.getElementById('staff-email').value;
    const role = document.getElementById('staff-role').value;
    const password = document.getElementById('staff-password').value;

    const tableBody = document.getElementById('staff-table-body');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${staffIdCounter++}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${password}</td>
        <td>
            <button onclick="editRow(this)">Edit</button>
            <button onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow);
    document.getElementById('add-staff-form').reset();
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');

    cells.forEach((cell, index) => {
        const input = document.createElement('input');
        input.value = cell.innerText;
        cell.innerHTML = '';
        cell.appendChild(input);
    });

    button.innerText = 'Save';
    button.onclick = () => saveChanges(button);
}

function saveChanges(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');

    cells.forEach(cell => {
        const input = cell.firstChild;
        cell.innerHTML = input.value;
    });

    button.innerText = 'Edit';
    button.onclick = () => editRow(button);
}

function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
}