// const HOST = 'localhost',
// 	PORT = '8000',
// 	LS_LOGIN_KEY = 'sports-login'

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
		survey_2: false,
		experimentName: '',
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

function setExperimentName(experimentName) {
	loginInfo.experimentName = experimentName
	console.log("Experiment Name setted to: " , experimentName)
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
