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
				email: loginInfo.userProfile.clientData.username || '',
			}
		}
		if (typeof loginInfo.paymentData !== 'undefined') {
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

		if (typeof loginInfo.shipmentData !== 'undefined') {
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
		loginInfo.userProfile.first_name = this.userInfo.clientData.name
		loginInfo.userProfile.last_name = this.userInfo.clientData.lastName
		loginInfo.userProfile.gender = Object.keys(genderMapping).find(key => genderMapping[key] === this.userInfo.clientData.genre) || "other"; // Map back to original gender value
		loginInfo.userProfile.birth = this.userInfo.clientData.birthDate
		loginInfo.userProfile.email = this.userInfo.clientData.username;

		if (typeof loginInfo.paymentData === 'undefined') {
			loginInfo.paymentData = {}
		}

		loginInfo.paymentData.cardOwner = this.userInfo.paymentData.cardOwner
		loginInfo.paymentData.cardNumber = this.userInfo.paymentData.cardNumber
		loginInfo.paymentData.dueDate = this.userInfo.paymentData.dueDate
		loginInfo.paymentData.cvvCode = this.userInfo.paymentData.cvvCode

		if (typeof loginInfo.shipmentData === 'undefined') {
			loginInfo.shipmentData = {}
		}
		loginInfo.shipmentData.country = this.userInfo.shipmentData.country
		loginInfo.shipmentData.postalCode = this.userInfo.shipmentData.postalCode
		loginInfo.shipmentData.city = this.userInfo.shipmentData.city
		loginInfo.shipmentData.roadType = this.userInfo.shipmentData.roadType
		loginInfo.shipmentData.roadMainInfo = this.userInfo.shipmentData.roadMainInfo
		loginInfo.shipmentData.roadExtraInfo = this.userInfo.shipmentData.roadExtraInfo
		saveLoginInfo()
	}
}


class ProfileController {
	profile = new Profile()

	constructor() {

	}

	saveProfileData(profileData) {
		this.profile.save_param(profileData)
	}

	getAge(birthDate) {
		birthDate = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	getProfileData() {
		const profileData = {
			nick: loginInfo.username,
			name: this.profile.userInfo.clientData.name,
			surname: this.profile.userInfo.clientData.lastName,
			genre: this.profile.userInfo.clientData.genre,
			age: this.getAge(this.profile.userInfo.clientData.birthDate),
			address: [this.profile.userInfo.shipmentData.roadMainInfo, this.profile.userInfo.shipmentData.roadExtraInfo].filter(Boolean).join(" "),
			city: this.profile.userInfo.shipmentData.city,
			country: this.profile.userInfo.shipmentData.country,
			email: this.profile.userInfo.clientData.email
		}
		//return this.profile.userInfo
		return profileData;
	}
}

var pfc = new ProfileController();