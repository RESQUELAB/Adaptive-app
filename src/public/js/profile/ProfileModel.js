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
            dueDate: new Date('2024-05'),
            cvvCode: ''
        }
    };

    constructor() {
        this.load();
		console.log("FROM THE PROFILE::: ", loginInfo)
    }

    load() {
		console.log("LOADDING....", )
		if(typeof loginInfo.userProfile !== 'undefined'){	

			this.userInfo.clientData = {
				name: loginInfo.userProfile.first_name,
				lastName: loginInfo.userProfile.last_name,
				genre: genderMapping[loginInfo.userProfile.gender.toLowerCase()] || 3,
				birthDate: new Date(loginInfo.userProfile.birth),
				email: loginInfo.userProfile.username,
			}
		}
		if(typeof loginInfo.paymentData !== 'undefined'){
			this.userInfo.paymentData = {
				cardOwner: loginInfo.paymentData.cardOwner,
				cardNumber: loginInfo.paymentData.cardNumber,
				dueDate: new Date(loginInfo.paymentData.dueDate),
				cvvCode: loginInfo.paymentData.cvvCode
			}
		}else {
			this.userInfo.paymentData= {
				cardOwner: '',
				cardNumber: '',
				dueDate: new Date('2024-05'),
				cvvCode: ''
			}
		}

		if(typeof loginInfo.shipmentData !== 'undefined'){
			this.userInfo.shipmentData = {
				country: loginInfo.shipmentData.country,
				postalCode: loginInfo.shipmentData.postalCode, 
				city: loginInfo.shipmentData.city, 
				roadType: loginInfo.shipmentData.roadType, 
				roadMainInfo: loginInfo.shipmentData.roadMainInfo, 
				roadExtraInfo: loginInfo.shipmentData.roadExtraInfo, 
			}
		}else {
			this.userInfo.shipmentData= {
				country: 1, // 1=España, 2=Portugal, 3=Francia, 4=Inglaterra, 5=Belgium
				postalCode: 46022,
				city: 'Valencia',
				roadType: 1, // 1= Avenida, 2=Calle, 3=Calle, 4=Plaza, 5=Carretera
				roadMainInfo: 'Cami de Vera',
				roadExtraInfo: 'S/N'
			}
		}
		console.log("loginInfo.paymentData", loginInfo.paymentData)
		console.log(loginInfo.paymentData == "undefined")

    }
	
	save_param(profileData) {
        this.userInfo = profileData;
		this.save();
    }

    save() {
		console.log("SAVED", this.userInfo)
		console.log("Frist name now is: ",this.userInfo.clientData.name)
		loginInfo.userProfile.first_name = this.userInfo.clientData.name
		loginInfo.userProfile.last_name = this.userInfo.clientData.lastName
		loginInfo.userProfile.gender = Object.keys(genderMapping).find(key => genderMapping[key] === this.userInfo.clientData.genre) || "other"; // Map back to original gender value
		loginInfo.userProfile.birth = this.userInfo.clientData.birthDate.toISOString(); // Save birth date in ISO format
		loginInfo.userProfile.email = this.userInfo.clientData.username;
		
		if(typeof loginInfo.paymentData === 'undefined'){
			loginInfo.paymentData = {}
		}

		loginInfo.paymentData.cardOwner = this.userInfo.paymentData.cardOwner
		loginInfo.paymentData.cardNumber = this.userInfo.paymentData.cardNumber
		loginInfo.paymentData.dueDate = this.userInfo.paymentData.dueDate.toISOString()
		loginInfo.paymentData.cvvCode = this.userInfo.paymentData.cvvCode
		
		if(typeof loginInfo.shipmentData === 'undefined'){
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
