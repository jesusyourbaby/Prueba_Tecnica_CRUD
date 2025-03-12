// Verificar si el usuario ya se ha autenticado
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.replace('dashboard.html');
    }
});

// Mostrar y ocultar la contraseña
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.textContent = 'Ocultar contraseña';
    } else {
        passwordInput.type = 'password';
        this.textContent = 'Mostrar contraseña';
    }
});

// Mostrar el envio del formulario del Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost/PruebaCRUD/backend/api/auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);  
            localStorage.setItem('userEmail', data.email);  
            window.location.href = 'dashboard.html';
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => console.error('Error: ', error));
});

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};