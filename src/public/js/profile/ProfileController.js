class ProfileController {
	profile = new Profile()

	constructor() {
	}

	
	render() {
		this.renderClientData()
		this.renderPaymentData()
		this.renderShipmentData()
	}

	renderClientData() {
		let c = this.profile.clientData
		let panel = $('#profile-panel-1').html(`
		<div>
			<label><h3 textid="lastname:1c"></h3>
			<input type="text" value="${c.lastName}"></label>
		</div>
		<div>
			<label><h3 textid="name:1c"></h3>
			<input type="text" value="${c.name}"></label>
		</div>
		<div>
			<label>
				<h3 textid="genre:1c"></h3>
				<input name="genre" value="1" ${c.genre == 1? 'checked' : ''} type="radio" name="genre"><span textid="man:1c"></span>
				<input name="genre" value="2" ${c.genre == 2? 'checked' : ''} type="radio" name="genre"><span textid="woman:1c"></span>
				<input name="genre" value="3" ${c.genre == 3? 'checked' : ''} type="radio" name="genre"><span textid="other:1c"></span>
			</label>
		</div>
		<div>
			<h3 textid="birthDate:1c"></h3>
			<input class="dateInput" value="${c.birthDate.getDate()}" type="text"> / 
			<input class="dateInput" value="${c.birthDate.getMonth() + 1}" type="text"> / 
			<input class="dateInput year" value="${c.birthDate.getFullYear()}" type="text">
		</div>
		<div></div>
		<div></div>
		<div>
			<label><h3 textid="email:1c"></h3>
			<input type="text" value="${c.email}"></label>
		</div>
		<div>
			<label><h3 textid="phone:1c"></h3>
			<input type="text" value="${c.phone}"></label>
		</div>
		<div></div>
		<div>
			<label>
				<input type="checkbox">
				<span textid="newsletterQuestion:1c"></span>
			</label>
		</div>
		<div></div>
		<div></div>
		<div><span>*</span> <span textid="requiredFields:1c"></span></div>
		<div>
			<button class="positive" textid="accept:1c"></button>
			<button class="negative" textid="cancel:1c"></button>
		</div>`)
		translateTexts(null, panel)
	}

	renderPaymentData() {
		let p = this.profile.paymentData
		let panel = $('#profile-panel-2').html(`
		<div>
			<p textid="acceptedCards:1c"></p>
		</div>
		<div></div>
		<div></div>
		<div>
			<label><h3 textid="cardOwner:1c"></h3>
			<input type="text" value="${p.cardOwner}"></label>
		</div>
		<div>
			<label><h3 textid="cardNumber:1c"></h3>
			<input type="text" class="cardNumber" value="${p.cardNumber}"></label>
		</div>
		<div></div>
		<div>
			<h3 textid="dueDate:1c"></h3>
			<input class="dateInput" value="${p.dueDate.getMonth() + 1}" type="text"> / 
			<input class="dateInput year" value="${p.dueDate.getFullYear()}" type="text">
		</div>
		<div>
			<label><h3 textid="cvvcode:1c"></h3>
			<input type="text" class="cvv" value="${p.cvvCode}"></label>
		</div>
		<div></div>
		<div><span>*</span> <span textid="requiredFields:1c"></span></div>
		<div>
			<button class="positive" textid="accept:1c"></button>
			<button class="negative" textid="cancel:1c"></button>
		</div>`)
		translateTexts(null, panel)
	}

	renderShipmentData() {
		let s = this.profile.shipmentData
		let panel = $('#profile-panel-3').html(`
		<div>
			<h3 textid="country:1c"></h3>
			<select>
				<option ${s.country == 1? 'selected' : ''}>Spain</option>
				<option ${s.country == 2? 'selected' : ''}>Portugal</option>
				<option ${s.country == 3? 'selected' : ''}>France</option>
				<option ${s.country == 4? 'selected' : ''}>England</option>
				<option ${s.country == 5? 'selected' : ''}>Belgium</option>
			</select>
		</div>
		<div><label>
				<h3 textid="postalcode:1c"></h3>
				<input type="text" value="${s.postalCode}" class="third">
		</label></div>
		<div><label>
			<h3 textid="city:1c"></h3>
			<input type="text" value="${s.city}">
		</label></div>
		<div>
			<h3 textid="roadType:1c"></h3>
			<select>
				<option ${s.roadType == 1? 'selected' : ''} textid="avenue:1c">Avenida</option>
				<option ${s.roadType == 2? 'selected' : ''} textid="street:1c">Calle</option>
				<option ${s.roadType == 3? 'selected' : ''} textid="square:1c">Plaza</option>
				<option ${s.roadType == 4? 'selected' : ''} textid="road:1c">Carretera</option>
				<option ${s.roadType == 5? 'selected' : ''} textid="officebox:1c">Apartado de correos</option>
			</select>
		</div>
		<div><label>
			<h3 textid="namenumberroad:1c"></h3>
			<input type="text" value="${s.roadMainInfo}">
		</label></div>
		<div></div>
		<div></div>
		<div><label>
			<h3 textid="roadextra:1c"></h3>
			<input type="text" value="${s.roadExtraInfo}">
		</label></div>
		<div></div>
		<div><span>*</span> <span textid="requiredFields:1c"></span></div>
		<div>
			<button class="positive" textid="accept:1c"></button>
			<button class="negative" textid="cancel:1c"></button>
		</div>`)
		translateTexts(null, panel)
	}
}