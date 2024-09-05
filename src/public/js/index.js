
// Toggle between Login and Registration form
function toggleForm() {
    const loginContainer = document.querySelector('.login-container');
    const registrationContainer = document.querySelector('.registration-container');

    const loginDisplay = window.getComputedStyle(loginContainer).display;
    const registrationDisplay = window.getComputedStyle(registrationContainer).display;

    loginContainer.style.display = loginDisplay === 'none' ? 'flex' : 'none';
    registrationContainer.style.display = registrationDisplay === 'none' ? 'flex' : 'none';
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


$('#login').on('click', function () {
    // checkServerStatus()
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
