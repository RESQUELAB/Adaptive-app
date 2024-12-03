$(function() {
  $("#tabsContainer").tabs();

  document.getElementById("saveButton").addEventListener("click", function() {
      const profileData = gatherProfileData();
      console.log("CLICKED SAVE, new profile:: ", profileData);
      
      pc.saveProfileData(profileData);
      
      showSuccessMessage("message-clientData", "El perfil se ha guardado correctamente!");
  });

  document.getElementById("saveButton2").addEventListener("click", function() {
      const profileData = gatherProfileData();
      console.log("CLICKED SAVE, new payment profile:: ", profileData.paymentData);
      
      pc.saveProfileData(profileData);
      
      showSuccessMessage("message-paymentData", "Los datos de pago se han guardado correctamente!");
  });

  document.getElementById("saveButton3").addEventListener("click", function() {
    const profileData = gatherProfileData();
    console.log("CLICKED SAVE, new profile:: ", profileData);
    
    pc.saveProfileData(profileData);
    showSuccessMessage("message-shipmentData", "Los datos de envío se han guardado correctamente!");
});
});


function gatherProfileData() {
  const selectedGender = document.querySelector('input[name="genre"]:checked');
  const genderValue = selectedGender ? parseInt(selectedGender.value) : null; // Get gender value or null if none selected
  // Assuming you're getting the payment data from inputs in the second tab
  const cardOwner = document.getElementById("cardOwnerInput").value;
  const cardNumber = document.getElementById("cardNumberInput").value; // Make sure you have this input in your HTML
  
  // Get values for the due date from two separate inputs
  const dueDateMonth = document.querySelector('.due-date-inputs .dateInput').value; // Month input
  const dueDateYear = document.querySelector('.due-date-inputs .year').value; // Year input

  // Create a date object from the gathered values
  const dueDate = new Date(dueDateYear, dueDateMonth - 1); // Month is 0-based in JS

  const cvvCode = document.getElementById("cvvCodeInput").value; // Make sure you have this input in your HTML


   // Get shipment data
   const shipmentData = {
    country: document.getElementById("countrySelect").value, // Selected country from dropdown
    postalCode: document.getElementById("postalCodeInput").value, // Postal code input
    city: document.getElementById("cityInput").value, // City input
    roadType: document.getElementById("roadTypeSelect").value, // Selected road type from dropdown
    roadMainInfo: document.getElementById("roadMainInfoInput").value, // Road main info input
    roadExtraInfo: document.getElementById("roadExtraInfoInput").value // Road extra info input
  };

  profileData = {
    shipmentData: shipmentData,
    clientData: {
      name: document.getElementById("nameInput").value,
        lastName: document.getElementById("surnameInput").value,
        genre: genderValue,
        birthDate: new Date(document.getElementById("birthDateInput").value)
        },
        paymentData: {
          cardOwner: cardOwner || "",
          cardNumber: cardNumber|| "",
          dueDate: dueDate,
          cvvCode: cvvCode || "",
      }
    }
  return profileData;
}

function showSuccessMessage(messageElementId, message) {
  const messageElement = document.getElementById(messageElementId);
  messageElement.textContent = message;
  messageElement.style.display = "block";

  setTimeout(() => {
      messageElement.style.display = "none";
  }, 3000); 
}

async function logout(){
  const confirmLogout = confirm("¿Estás seguro de cerrar sesión?");
  if (confirmLogout) {
    console.log("OK. LOGING OUT")
    try {
      await user_logout();
      document.location = './selection.html';
    } catch (error) {
        console.log(error)
    }
  }else{
    console.log("Not yet...")
  }
}

function openTab(evt, profileTab) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(profileTab).style.display = "block";
  evt.currentTarget.className += " active";
}

function goBack() {
  window.history.back();
}

document.getElementById("defaultProfile").click();

let pc = new ProfileController()
pc.render()