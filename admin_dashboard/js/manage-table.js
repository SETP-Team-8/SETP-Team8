function editRow(button) {
    var row = button.closest('tr');
    row.querySelector('.table-number').contentEditable = 'true';
    row.querySelector('.seats').contentEditable = 'true';
    button.style.display = 'none';
    row.querySelector('.save-btn').style.display = 'inline';
}

function saveRow(button) {
    var row = button.closest('tr');
    row.querySelector('.table-number').contentEditable = 'false';
    row.querySelector('.seats').contentEditable = 'false';
    button.style.display = 'none';
    row.querySelector('.edit-btn').style.display = 'inline';
}

function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
}