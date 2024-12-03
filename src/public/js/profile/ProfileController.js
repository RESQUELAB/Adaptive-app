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
		console.log("CART RENDERING!!!")
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
<input id="birthDateInput" class="dateInput" value="${c.birthDate.toISOString().split('T')[0]}" type="date">
		</div>
		<div></div>
		<div></div>
		<div>
			<label><h3 textid="email:1c"></h3>
			<input type="text" value="${c.email}" readonly></label>
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
			<input class="dateInput" value="${p.dueDate.getMonth() + 1}" type="text"> / 
			<input class="dateInput year" value="${p.dueDate.getFullYear()}" type="text">
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