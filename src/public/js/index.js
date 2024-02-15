
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

$('#login').on('click', function() {
    let user = $('#username')[0].value
    loginInfo.username = user
    saveLoginInfo()
    document.location = './catalog.html'
})

$('#username')[0].value = loadLoginInfo().username