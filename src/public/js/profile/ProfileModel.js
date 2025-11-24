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
			birthDate: new Date('1993-07-12').toISOString(),
			email: '',
		},
		paymentData: {
			cardOwner: '',
			cardNumber: '',
			dueDate: new Date('2024-05-01').toISOString(),
			cvvCode: ''
		}
	};

	constructor() {
		this.load();
		console.log("FROM THE PROFILE::: ", loginInfo);
	}

	load() {
		console.log("LOADING FROM THE PROFILE....");
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
				dueDate: new Date('2024-05-01').toISOString(),
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
		//this.save_param(loginInfo.userProfile);
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
		saveLoginInfo()
	}
}
