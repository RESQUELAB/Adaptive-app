// const HOST = 'localhost',
// 	PORT = '8000',
// 	LS_LOGIN_KEY = 'sports-login'


	const HOST = '158.42.185.67',
    PORT = '9999'
	LS_LOGIN_KEY = 'sports-login'

var loginInfo = null
var amIconnected = false
function loadLoginInfo() {
	const defaultLoginInfo = {
		sessionID: '',
		username: '',
		session: 0,
		groupDefinition: {},
		userProfile: {},
		catalogue_1: false,
		catalogue_2: false,
		survey_1: false,
		survey_2: false,  // Ensure this is always initialized
	};

	// Merge default values with stored values, ensuring all keys are initialized
	return { ...defaultLoginInfo, ...JSON.parse(localStorage.getItem(LS_LOGIN_KEY)) || {} };
}


function saveLoginInfo() {
	localStorage.setItem(LS_LOGIN_KEY, JSON.stringify(loginInfo))
}

function setUsername(username){
	console.log("SETTING THE USERNAME TO:: ", username)
	loginInfo.username = username
	saveLoginInfo()
}

function setCatalogue_1_finished(){
	loginInfo.catalogue_1 = true;
	console.log("Catalogue 1 finished!")
	saveLoginInfo();
}

function setCatalogue_2_finished(){
	loginInfo.catalogue_2 = true;
	console.log("Catalogue 2 finished!")
	saveLoginInfo();
}

function setSurvey_1_finished(){
	loginInfo.survey_1 = true;
	console.log("Survey 1 finished!")
	saveLoginInfo();
}

function setSurvey_2_finished(){
	loginInfo.survey_2 = true;
	console.log("Survey 2 finished!")
	saveLoginInfo();
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

function experimentCompleted(){
	socket.emit("experimentCompleted")
}

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
	socket.emit("askForProfile", loginInfo.username)
}


async function user_logout() {
    // Emit a login request to the proxy server
    socket.emit('logoutRequest');

    // Create a promise to wait for the response from the server
    return new Promise((resolve, reject) => {
        socket.once('logoutResponse', function (response) {
            if (response.success === true) {
				console.log("CLEARING LS...")

				/* CLEAR LOCAL STORAGE AND PREPARE FOR THE NEXT CATALOGUE! */
				localStorage.setItem("favourite-articles", JSON.stringify([]))
				localStorage.setItem("cart-articles", JSON.stringify([]))
				localStorage.setItem("app-orders", JSON.stringify([]))
				console.log("CLEARED LS...")

				if(!loginInfo.catalogue_1){
					// if Catalogue 1 is not finished. Let's go for the Survey.
					setCatalogue_1_finished();
				}
				else if(!loginInfo.catalogue_2){
					setCatalogue_2_finished();
				}

                resolve(response);
            } else {
                reject(response.message); 
            }
        });
    });
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
	console.log("Sending Image...")
	// console.log("Image as String:", imageString)
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