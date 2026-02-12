// --- ADD THIS AT THE VERY TOP OF userModel.js ---
const LS_LOGIN_KEY = 'sports-login';

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
    const stored = localStorage.getItem(LS_LOGIN_KEY);
    return { ...defaultLoginInfo, ...(stored ? JSON.parse(stored) : {}) };
}

// Global variable that the Profile class expects
var loginInfo = loadLoginInfo();

// Helper to save it back if modified
function saveLoginInfo() {
    localStorage.setItem(LS_LOGIN_KEY, JSON.stringify(loginInfo));
}
// ------------------------------------------------

const genderMapping = {
	male: 1,
	female: 2,
	other: 3
};

class Profile {
	static LS_PROFILE = 'sports-profile';

	userInfo = {
		shipmentData: {
			country: 1, // 1=España, 2=Portugal, 3=Francia, 4=Inglaterra, 5=Belgium
			postalCode: 46022,
			city: 'Valencia',
			roadType: 1, // 1= Avenida, 2=Calle, 3=Calle, 4=Plaza, 5=Carretera
			roadMainInfo: 'Calle de los oficios, 8',
			roadExtraInfo: 'bloque B, escalera 1, altura 3, puerta 17'
		},
		clientData: {
			name: '',
			lastName: '',
			genre: 1, // 1=Hombre, 2=Mujer, 3=Otro
			birthDate: new Date('1993-07-12'),
			email: '',
		},
		paymentData: {
			cardOwner: '',
			cardNumber: '',
			dueDate: new Date('2024-05-01'),
			cvvCode: ''
		}
	};

	constructor() {
		this.load();
		console.log("FROM THE PROFILE::: ", loginInfo);
	}

	load() {
		console.log("LOADING FROM THE PROFILE....");
		if (!loginInfo || !loginInfo.userProfile || !loginInfo.userProfile.clientData) {
			console.warn("loginInfo not ready yet.");
			return; 
    	}
		if (typeof loginInfo.userProfile !== 'undefined') {

			console.log(loginInfo.userProfile)

			this.userInfo.clientData = {
				name: loginInfo.userProfile.clientData.first_name || '',
				lastName: loginInfo.userProfile.clientData.last_name || '',
				genre: genderMapping[loginInfo.userProfile.clientData.gender?.toLowerCase?.()] || 3,
				birthDate: new Date(loginInfo.userProfile.clientData.birth) || new Date(),
				email: loginInfo.userProfile.clientData.email || '',
			}
		}
		if (typeof loginInfo.userProfile.paymentData !== 'undefined') {
			this.userInfo.paymentData = {
				cardOwner: loginInfo.userProfile.paymentData.cardOwner,
				cardNumber: loginInfo.userProfile.paymentData.cardNumber,
				dueDate: new Date(loginInfo.userProfile.paymentData.dueDate),
				cvvCode: loginInfo.userProfile.paymentData.cvvCode
			}
		} else {
			this.userInfo.paymentData = {
				cardOwner: '',
				cardNumber: '',
				dueDate: new Date('2024-05-01'),
				cvvCode: ''
			}
		}

		if (typeof loginInfo.userProfile.shipmentData !== 'undefined') {
			this.userInfo.shipmentData = {
				country: loginInfo.userProfile.shipmentData.country,
				postalCode: loginInfo.userProfile.shipmentData.postalCode,
				city: loginInfo.userProfile.shipmentData.city,
				roadType: loginInfo.userProfile.shipmentData.roadType,
				roadMainInfo: loginInfo.userProfile.shipmentData.roadMainInfo,
				roadExtraInfo: loginInfo.userProfile.shipmentData.roadExtraInfo,
			}
		} else {
			this.userInfo.shipmentData = {
				country: 1, // 1=España, 2=Portugal, 3=Francia, 4=Inglaterra, 5=Belgium
				postalCode: 46022,
				city: 'Valencia',
				roadType: 1, // 1= Avenida, 2=Calle, 3=Calle, 4=Plaza, 5=Carretera
				roadMainInfo: 'Cami de Vera',
				roadExtraInfo: 'S/N'
			}
		}
		console.log("loginInfo.paymentData", loginInfo.userProfile.paymentData)
		console.log(loginInfo.userProfile.paymentData == "undefined")
		console.log("User info loaded:", this.userInfo);
		this.save_param(loginInfo.userProfile);
	}

	save_param(profileData) {
		this.userInfo = profileData;
		this.save();
	}

	save() {
		console.log("SAVED", this.userInfo)
		console.log("First name now is: ", this.userInfo.clientData.name)
		loginInfo.userProfile.clientData.first_name = this.userInfo.clientData.name
		loginInfo.userProfile.clientData.last_name = this.userInfo.clientData.lastName
		loginInfo.userProfile.clientData.gender = Object.keys(genderMapping).find(key => genderMapping[key] === this.userInfo.clientData.genre) || "other"; // Map back to original gender value
		loginInfo.userProfile.clientData.birth = this.userInfo.clientData.birthDate
		loginInfo.userProfile.clientData.email = this.userInfo.clientData.email;

		if (typeof loginInfo.userProfile.paymentData === 'undefined') {
			loginInfo.userProfile.paymentData = {}
		}

		loginInfo.userProfile.paymentData.cardOwner = this.userInfo.paymentData.cardOwner
		loginInfo.userProfile.paymentData.cardNumber = this.userInfo.paymentData.cardNumber
		loginInfo.userProfile.paymentData.dueDate = this.userInfo.paymentData.dueDate
		loginInfo.userProfile.paymentData.cvvCode = this.userInfo.paymentData.cvvCode

		if (typeof loginInfo.userProfile.shipmentData === 'undefined') {
			loginInfo.userProfile.shipmentData = {}
		}
		loginInfo.userProfile.shipmentData.country = this.userInfo.shipmentData.country
		loginInfo.userProfile.shipmentData.postalCode = this.userInfo.shipmentData.postalCode
		loginInfo.userProfile.shipmentData.city = this.userInfo.shipmentData.city
		loginInfo.userProfile.shipmentData.roadType = this.userInfo.shipmentData.roadType
		loginInfo.userProfile.shipmentData.roadMainInfo = this.userInfo.shipmentData.roadMainInfo
		loginInfo.userProfile.shipmentData.roadExtraInfo = this.userInfo.shipmentData.roadExtraInfo
		saveLoginInfo();
		setUsername(this.userInfo.clientData.name);
		setUserProfile(this.userInfo);
	}
}


class ProfileController {
	profile = new Profile()

	constructor() {

	}

	saveProfileData(profileData) {
		this.profile.save_param(profileData)
	}

	render() {
		this.renderClientData()
		this.renderPaymentData()
		this.renderShipmentData()
	}
	render_cart(){
		let c = this.profile.userInfo.clientData
		let cship = this.profile.userInfo.shipmentData
		let cpay = this.profile.userInfo.paymentData

		let panel = $('#userData').html(`
			<div id="personalData">
						<h3>Datos personales</h3>
						<p>${c.name} ${c.lastName}</p>
						<p>${cship.roadMainInfo}, ${cship.roadExtraInfo}</p>
						<p>${cship.postalCode} ${cship.city}</p>
					</div>
					<div id="paymentData">
						<h3>Datos de pago</h3>
						<p>Método de pago: Tarjeta de débito</p>
						<p>VISA: ${cpay.cardNumber}</p>
					</div>
					<div style="text-align: left; margin: 20px 0; border: 0;">
			<a href="order.html?action=list" style="color: #007bff; text-decoration: none; font-size: 16px;">
				Mis pedidos
			</a>
		</div>
		`)

		console.log("this is the panel!: ", panel)
		
		translateTexts(null, panel)
	}


	renderClientData() {
		let c = this.profile.userInfo.clientData
		let panel = $('#profile-panel-1').html(`
			<div>
				<label><h3 textid="name:1c"></h3>
				<input id="nameInput" type="text" value="${c.name}"></label>
			</div>
		<div>
			<label><h3 textid="lastname:1c"></h3>
			<input id="surnameInput" type="text" value="${c.lastName}"></label>
		</div>
		<div>
			<label>
				<h3 textid="genre:1c"></h3>
				<input id="genre1" name="genre" value="1" ${c.genre == 1? 'checked' : ''} type="radio" name="genre"><span textid="man:1c"></span>
				<input id="genre2" name="genre" value="2" ${c.genre == 2? 'checked' : ''} type="radio" name="genre"><span textid="woman:1c"></span>
				<input id="genre3"  name="genre" value="3" ${c.genre == 3? 'checked' : ''} type="radio" name="genre"><span textid="other:1c"></span>
			</label>
		</div>
		<div>
			<h3 textid="birthDate:1c"></h3>
<input id="birthDateInput" class="dateInput" value="${c.birthDate.split('T')[0]}" type="date">
		</div>
		<div></div>
		<div></div>
		<div>
			<label><h3 textid="email:1c"></h3>
			<input id="emailInput" type="text" value="${c.email}"></label>
		</div>
		
		<!-- <div><span>*</span> <span textid="requiredFields:1c"></span></div> -->
		
		    <div id="message-clientData" style="display: none; color: green;"></div>

		<div class="button-group">
			<button class="back-button" onclick="goBack()">Atrás</button>
			<button id="saveButton" class="positive" textid="accept:1c"></button>
		</div>
		`)
		
		translateTexts(null, panel)
	}

	renderPaymentData() {
		let p = this.profile.userInfo.paymentData
		let panel = $('#profile-panel-2').html(`
		
		<div></div>
		<div></div>
		<div>
			<label><h3 textid="cardOwner:1c"></h3>
			<input id="cardOwnerInput" type="text" value="${p.cardOwner}"></label>
		</div>
		<div>
			<label><h3 textid="cardNumber:1c"></h3>
			<input id="cardNumberInput" type="text" class="cardNumber" value="${p.cardNumber}"></label>
		</div>
		<div></div>
		<div class="due-date-inputs">
			<h3 textid="dueDate:1c"></h3>
			<input class="dateInput" value="${p.dueDate.split('T')[0].split('-')[1]}" type="text"> / 
			<input class="dateInput year" value="${p.dueDate.split('T')[0].split('-')[0]}" type="text">
		</div>

		<div>
			<label><h3 textid="cvvcode:1c"></h3>
			<input id="cvvCodeInput" type="text" class="cvv" value="${p.cvvCode}"></label>
		</div>
		
		<div id="message-paymentData" style="display: none; color: green;"></div>

		<div class="button-group">
			<button class="back-button" onclick="goBack()">Atrás</button>
			<button id="saveButton2" class="positive" textid="accept:1c"></button>
		</div>
		`)
		translateTexts(null, panel)
	}

	renderShipmentData() {
		let s = this.profile.userInfo.shipmentData
		let panel = $('#profile-panel-3').html(`
		<div>
			<h3 textid="country:1c"></h3>
      		<select id="countrySelect">
				<option value="1" ${s.country == 1 ? 'selected' : ''}>Spain</option>
				<option value="2" ${s.country == 2 ? 'selected' : ''}>Portugal</option>
				<option value="3" ${s.country == 3 ? 'selected' : ''}>France</option>
				<option value="4" ${s.country == 4 ? 'selected' : ''}>England</option>
				<option value="5" ${s.country == 5 ? 'selected' : ''}>Belgium</option>
			</select>
		</div>
		<div><label>
				<h3 textid="postalcode:1c"></h3>
				<input id="postalCodeInput" type="text" value="${s.postalCode}" class="third">
		</label></div>
		<div><label>
			<h3 textid="city:1c"></h3>
			<input id="cityInput" type="text" value="${s.city}">
		</label></div>
		<div>
			<h3 textid="roadType:1c"></h3>
			<select id="roadTypeSelect">
				<option value="1" ${s.roadType == 1? 'selected' : ''} textid="avenue:1c">Avenida</option>
				<option value="2" ${s.roadType == 2? 'selected' : ''} textid="street:1c">Calle</option>
				<option value="3" ${s.roadType == 3? 'selected' : ''} textid="square:1c">Plaza</option>
				<option value="4" ${s.roadType == 4? 'selected' : ''} textid="road:1c">Carretera</option>
				<option value="5" ${s.roadType == 5? 'selected' : ''} textid="officebox:1c">Apartado de correos</option>
			</select>
		</div>
		<div><label>
			<h3 textid="namenumberroad:1c"></h3>
			<input id="roadMainInfoInput" type="text" value="${s.roadMainInfo}">
		</label></div>
		<div></div>
		<div></div>
		<div><label>
			<h3 textid="roadextra:1c"></h3>
			<input id="roadExtraInfoInput" type="text" value="${s.roadExtraInfo}">
		</label></div>
				<div id="message-shipmentData" style="display: none; color: green;"></div>

		<div class="button-group">
			<button class="back-button" onclick="goBack()">Atrás</button>
			<button id="saveButton3" class="positive" textid="accept:1c"></button>
		</div>
		`)
		translateTexts(null, panel)
	}
}

var pfc = new ProfileController();