const HOST = 'localhost',
	PORT = '8000',
	LS_LOGIN_KEY = 'sports-login'

var loginInfo = null
var amIconnected = false
function loadLoginInfo() {
	return JSON.parse(localStorage.getItem(LS_LOGIN_KEY)) || {
		sessionID: '',
		username: '',
		session: 0,
		groupDefinition: {},
		userProfile: {},
	}
}

function saveLoginInfo() {
	localStorage.setItem(LS_LOGIN_KEY, JSON.stringify(loginInfo))
}

function setUsername(username){
	console.log("SETTING THE USERNAME TO:: ", username)
	loginInfo.username = username
	saveLoginInfo()
}

function setUserProfile(userProfile){
	loginInfo.userProfile = userProfile
	console.log("this is the user profile:" ,loginInfo.userProfile)
	saveLoginInfo()
}

function setSession(session) {
	loginInfo.session = session
	saveLoginInfo()
}

function setGroupDefinition(groupDefinition) {
	loginInfo.groupDefinition = groupDefinition
	saveLoginInfo()
}

loginInfo = loadLoginInfo()
if (loginInfo.username != '') {
	$(document).ready(function () {
		let e = $('.header a.userbutton[href="./profile.html"] > .profileName')
		e.removeAttr('textid')
		e.text(loginInfo.username)
	})
}

const socket = io(`http://${HOST}:${PORT}`, {
	reconnection: false,
	auth: {
		sessionID: loginInfo.sessionID,
		username: loginInfo.username,
		page: new URL(document.location).pathname,
		mutations: mc.mutations,
		all_mutations: mc.all_mutations
	},
	cors: { origin: "*" }
})

function sendUpdateName(msg) {
	socket.emit("updateName", msg)
}

function askForAgent(value) {
	socket.emit("askForAgent", value)
}

function sendClickInfo(msg) {
	socket.emit('click', msg)
	//console.log("click enviado")
}

function sendScrollInfo(msg) {
	socket.emit('scroll', msg)
	// console.log("click enviado")
}

function getProfileInformation(){
	console.log("ASKING FOR INFORMATION FROM:: ", loginInfo.username)
	socket.emit("askForProfile", loginInfo.username)
}

socket.on('profileInformation', (profile) => {
	console.log(profile)
})

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
	socket.emit('updateState', mc.mutations)
})

socket.on('location', (location, value) => {
	console.log(location, value)
	if (check(location).isEmptyString()) return
	if (check(value).isEmptyString()) return

	document.location = value;
	// socket.emit('updateState', mc.mutations)
})

socket.on('getImage', async (callback) => {
	const image = await electron.getImage()
	const imageString = image.toDataURL()
	console.log("Image object:", image)
	console.log("Image as String:", imageString)
	callback(imageString)
	// socket.emit('updateState', mc.mutations)
})

socket.on('setSessionID', (value) => {
	loginInfo.sessionID = value
	saveLoginInfo()
	console.log('session id setted')
})

socket.on("setExperimentSession", (value) => {
	loginInfo.session = value
	saveLoginInfo()
	console.log("Experiment Session setted to: " , value)
})

socket.on('disconnect', () => {
	console.log('Disconnected from server.')
})