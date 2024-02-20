
function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var toggleButton = document.querySelector('.toggle-password i');

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

function getUsername(){
    return $('#username')[0].value
}

$('#login').on('click', function() {
    if($('#password')[0].value != "cso2024"){
        document.getElementById('login-message').textContent = 'Contraseña incorrecta';
        return
    }
    loginInfo.username = getUsername()
    saveLoginInfo()
    document.location = './catalog.html'
})


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