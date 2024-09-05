
// Toggle between Login and Registration form
function toggleForm() {
    const loginContainer = document.querySelector('.login-card');
    const registrationContainer = document.querySelector('.register-card');

    const loginDisplay = window.getComputedStyle(loginContainer).display;
    const registrationDisplay = window.getComputedStyle(registrationContainer).display;

    loginContainer.style.display = loginDisplay === 'none' ? 'block' : 'none';
    registrationContainer.style.display = registrationDisplay === 'none' ? 'block' : 'none';
}


function togglePasswordVisibility(inputId, toggleElement) {
    var passwordInput = document.getElementById(inputId);
    var toggleButton = toggleElement.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    }
}


function getUsername() {
    return $('#username')[0].value
}


$('#register').on('click', function () {
    // Obtener los valores ingresados en el formulario de registro
    var username = $('#reg-username')[0].value;
    var password = $('#reg-password')[0].value;

    // Validar que todos los campos estén completos (puedes agregar más validaciones si es necesario)
    if (!username || !password) {
        document.getElementById('registration-message').textContent = 'Por favor, completa todos los campos';
        return;
    }

    // Emitir un evento de registro al servidor con los datos
    socket.emit('registerRequest', { username: username, password: password });

    // Esperar la respuesta del servidor
    var registrationPromise = new Promise(function (resolve, reject) {
        socket.once('registerResponse', function (response) {
            resolve(response); // Resolver la promesa con la respuesta del servidor
        });
    });

    // Manejar la respuesta del servidor
    registrationPromise.then(function (response) {
        console.log(response)
        console.log(response.success)
        if (response.success === true) {
            // Registro exitoso, redirigir a la página de inicio de sesión
            document.getElementById('registration-message').textContent = 'Registro exitoso. Puede iniciar sesión';
            setTimeout(function() {
                toggleForm()
                document.getElementById('login-message').textContent = 'Registro exitoso. Puede iniciar sesión';
                document.getElementById('username').value = username;
            }, 2000); // Esperar 2 segundos antes de redirigir
        } else {
            // Mostrar un mensaje de error si el registro falla
            document.getElementById('registration-message').textContent = 'Error en el registro: ' + response.message;
        }
    }).catch(function (error) {
        document.getElementById('registration-message').textContent = 'Error de conexión: ' + error;
    });
});

$('#login').on('click', function () {
    // checkServerStatus()
    console.log("Trying to log in.")
    console.log(socket)
    // Get the password from the user input
    var password = $('#password')[0].value
    // Send login request to the server
    socket.emit('loginRequest', password);
    // Wait for response from the server
    var loginPromise = new Promise(function (resolve, reject) {
        socket.once('login', function (response) {
            resolve(response); // Resolve the promise with the response from the server
        });
    });

    // Handle the response from the server
    loginPromise.then(function (response) {
        if (response === 1) {
            // Login successful, redirect to catalog page
            loginInfo.username = getUsername();
            saveLoginInfo();
            document.location = './catalog.html';
        } else {
            document.getElementById('login-message').textContent = 'Contraseña incorrecta';
        }
    }).catch(function (error) {
        document.getElementById('login-message').textContent = error;
    });
});




function checkServerStatus() {
    document.getElementById('server-indicator_text').textContent = 'Connecting...';
    document.getElementById('server-indicator').classList.remove("connected");
    document.getElementById('refresh-button').classList.add("connecting");

    fetch('http://localhost:8000/check-status')
        .then(response => {
            if (response.ok) {
                document.getElementById('server-indicator_text').textContent = 'Connected';
                document.getElementById('server-indicator').classList.add("connected");
                document.getElementById('refresh-button').classList.remove("connecting");
                loginInfo.username = getUsername()
                saveLoginInfo()
                sendUpdateName(loginInfo)
            } else {
                // Proxy is OFF
                document.getElementById('server-indicator_text').textContent = "Server is down. Try again later";
                document.getElementById('refresh-button').classList.remove("connecting");

            }
        })
        .catch(error => {
            document.getElementById('server-indicator_text').textContent = 'Proxy is off. Launch it first.';
            document.getElementById('refresh-button').classList.remove("connecting");
            console.error('Error while checking server status:', error);
        });
}

$('#username')[0].value = loadLoginInfo().username
