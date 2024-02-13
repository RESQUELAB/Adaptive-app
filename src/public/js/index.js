$('#login').on('click', function() {
    let user = $('#username')[0].value
    loginInfo.username = user
    saveLoginInfo()
    document.location = './catalog.html'
})

$('#username')[0].value = loadLoginInfo().username