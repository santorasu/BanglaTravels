document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const shortDescription = document.getElementById("short-description");
    const fullDescription = document.getElementById("full-description");

    toggleBtn.addEventListener("click", function () {
        if (fullDescription.style.display === "none") {
            fullDescription.style.display = "block";
            shortDescription.style.display = "none";
            toggleBtn.textContent = "Show Less";
        } else {
            fullDescription.style.display = "none";
            shortDescription.style.display = "block";
            toggleBtn.textContent = "Show More";
        }
    });
});


async function fetchUsers() {
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();
    displayUsers(users);
    // return users;
}

function displayUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}
let selectedUser = null;
async function createUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    });
    // Clear input fields
    clearInputFields();
    fetchUsers();
}

async function deleteUser(id) {
    await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE'
    });
    fetchUsers();
}

async function editUser(id) {
    selectedUser = id;
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const user = await response.json();
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;

    document.querySelector('button[onclick="createUser()"]').style.display = 'none';
    document.querySelector('button[onclick="updateUser()"]').style.display = 'inline';
}

async function updateUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    await fetch(`http://localhost:3000/api/users/${selectedUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    });
    // Clear input fields and reset UI
    clearInputFields();
    document.querySelector('button[onclick="createUser()"]').style.display = 'inline';
    document.querySelector('button[onclick="updateUser()"]').style.display = 'none';
    selectedUser = null;
    alert('User updated successfully');
    fetchUsers();
}

// Add this new helper function
function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}

fetchUsers();
