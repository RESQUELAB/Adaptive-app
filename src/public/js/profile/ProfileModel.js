class Profile {
	static LS_PROFILE = 'sports-profile'

	shipmentData = {
		country: 1, // 1=España, 2=Portugal, 3=Francia, 4=Englad, 5=Belgium
		postalCode: 46022,
		city: 'Valencia',
		roadType: 1, // 1= Avenida, 2=Calle, 3=Calle, 4=Plaza, 5=Carretera
		roadMainInfo: 'Calle de los oficios, 8',
		roadExtraInfo: 'bloque B, escalera 1, altura 3, puerta 17'
	}
	
	clientData = {
		name: 'Alberto',
		lastName: 'Contador',
		genre: 1, // 1=Hombre, 2=Mujer, 3=Otro
		birthDate: new Date('1993-07-12'),
		email: 'albertoco@fastmail.com',
		phone: '666555444'
	}
	
	paymentData = {
		cardOwner: 'Alberto Contador',
		cardNumber: '4444 3333 2222 1111',
		dueDate: new Date('2024-05'),
		cvvCode: '124'
	}

	constructor() {
		this.load()
	}

	load() {
		// TODO
	}

	save() {
		// TODO
	}
}