
function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var toggleButton = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '👁️';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

$('#login').on('click', function() {
    let user = $('#username')[0].value
    loginInfo.username = user
    saveLoginInfo()
    document.location = './catalog.html'
})

$('#username')[0].value = loadLoginInfo().username