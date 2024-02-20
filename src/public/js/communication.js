const HOST = 'localhost',
	  PORT = '8000',
	  LS_LOGIN_KEY = 'sports-login'

var loginInfo = null
var amIconnected = false
function loadLoginInfo() {
	return JSON.parse(localStorage.getItem(LS_LOGIN_KEY)) || {
		sessionID: '', 
		username: ''
	}
}
function saveLoginInfo() {
	localStorage.setItem(LS_LOGIN_KEY, JSON.stringify(loginInfo))
}


loginInfo = loadLoginInfo()
if (loginInfo.username != '') {
	$(document).ready(function() {
		let e = $('.header a.userbutton[href="./profile.html"] > .profileName')
		e.removeAttr('textid')
		e.text(loginInfo.username)
	})
}


const socket = io( `http://${HOST}:${PORT}` , {
	reconnection: false,
	auth: {
		sessionID: loginInfo.sessionID,
		username: loginInfo.username,
		page: new URL(document.location).pathname,
		mutations: mc.mutations
	},
	cors: {origin:"*"}
})

function sendUpdateName(msg){
	socket.emit("updateName", msg)
}

function sendClickInfo(msg) {
	socket.emit('click', msg)
	//console.log("click enviado")
}

function sendScrollInfo(msg) {
	socket.emit('scroll', msg)
	// console.log("click enviado")
}

socket.on('connect', (Socket) => {
	console.log('Connection established to server.')
	amIconnected = true

})

socket.on('connect_error', (socket) => {
	console.log('Couldn\'t connect to server.')
})

socket.on('mutation', (mutation, value) => {
	console.log(mutation, value)
	if (check(mutation).isEmptyString()) return
	if (check(value).isEmptyString()) return

	mc.mutate(mutation, value)
})

socket.on('setSessionID', (value) => {
	loginInfo.sessionID = value
	saveLoginInfo()
	console.log('session id setted')
})

socket.on('disconnect', () => {
	console.log('Disconnected from server.')
})