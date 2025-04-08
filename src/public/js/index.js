// Navigate to Step 2
function goToStep2() {
    // Get all inputs in Step 1
    const step1Inputs = document.querySelectorAll('#step1 input');
  
    // Validate Step 1 fields
    let valid = true;

  
    // Get password and confirm password fields
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm-password"]');

    // Check if passwords match
    if (confirmPasswordInput.value !== passwordInput.value) {
        valid = false;
        confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden.'); // Set custom error message
    } else {
        confirmPasswordInput.setCustomValidity(''); // Clear any custom error message
    }

    step1Inputs.forEach(input => {
      if (!input.reportValidity()) {
        console.log(input, " is not valid!")
        valid = false;
      }
    });
  
    if (valid) {
      // Disable Step 1 inputs
      step1Inputs.forEach(input => input.disabled = true);
  
    // Enable Step 2 inputs, except the data protection checkbox
    const step2Inputs = document.querySelectorAll('#step2 input');
    step2Inputs.forEach(input => {
      if (input.id !== 'data-protection-checkbox' || input.checked) {
        input.disabled = false;
      }
      });
  
      // Hide Step 1 and Show Step 2
      document.querySelector('#step1').classList.remove('active');
      document.querySelector('#step2').classList.add('active');
    }
  }
  
  function goToStep1() {
    // Enable Step 1 inputs
    const step1Inputs = document.querySelectorAll('#step1 input');
    step1Inputs.forEach(input => input.disabled = false);
  
    // Disable Step 2 inputs
    const step2Inputs = document.querySelectorAll('#step2 input');
    step2Inputs.forEach(input => input.disabled = true);
  
    // Show Step 1 and Hide Step 2
    document.querySelector('#step2').classList.remove('active');
    document.querySelector('#step1').classList.add('active');
  }
  
  function getSelectedGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked'); // Select the checked radio button
    return selectedGender ? selectedGender.id : null; // Return the ID of the selected button or null if none are selected
}
function getSelectedOccupations() {
    const selectedOccupations = [];
    const checkboxes = document.querySelectorAll('input[name="occupation"]:checked'); // Select all checked checkboxes
    checkboxes.forEach(checkbox => {
        selectedOccupations.push(checkbox.value); // Push the value of each checked checkbox into the array
    });
    return selectedOccupations; // Return the array of selected values
}

// Handle form submission
document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting immediately
    
    // Perform additional validation or process data here if needed
    const form = event.target;
    const dataProtectionCheckbox = document.querySelector('input[name="data_protection"]');
    console.log("Form is valid: ", form.checkValidity());
    console.log("Data protection checkbox is checked: ", dataProtectionCheckbox.checked);
    if (form.checkValidity() && dataProtectionCheckbox.checked) {
        console.log("Form is valid, submitting...");
        // Obtain form values
        var first_name = document.querySelector('input[name="name"]').value; 
        var last_name = document.querySelector('input[name="surname"]').value;
        var username = document.querySelector('input[name="username"]').value;
        var birth = document.querySelector('input[name="birth"]').value; 
        var password = document.querySelector('input[name="password"]').value; 
        var password2 = document.querySelector('input[name="confirm-password"]').value;
        var gender = getSelectedGender();
        var occupations = getSelectedOccupations(); 
        var field = document.querySelector('input[name="field"]').value; 
        var background = document.querySelector('input[name="background"]').value;
        var usageFrequencyPC = document.querySelector('input[name="pc_frequency"]').value;
        var usageFrequencySmartphone = document.querySelector('input[name="smartphone_frequency"]').value;
        var usageFrequencyTablet = document.querySelector('input[name="tablet_frequency"]').value;
        var usageFrequencyConsole = document.querySelector('input[name="console_frequency"]').value;


        
    // Register the user through the proxy server
    socket.emit('registerRequest', { 
        username: username, 
        password: password, 
        password2: password2,
        first_name: first_name,
        last_name: last_name,
        birth: birth,
        gender: gender,
        occupations: occupations,
        field: field,
        background: background,
        usageFrequencyPC: usageFrequencyPC,
        usageFrequencySmartphone: usageFrequencySmartphone,
        usageFrequencyTablet: usageFrequencyTablet,
        usageFrequencyConsole: usageFrequencyConsole,
     });

    var registerPromise = new Promise(function (resolve, reject) {
        socket.once('registerResponse', function (response) {
            resolve(response);
        });
    });

    registerPromise.then(async function (response) {
        if (response.success === true) {
            try {
                await loginUser(username, password);
                document.location = './selection.html';
            } catch (error) {
                document.getElementById('registration-message').textContent = 'Error during login after registration: ' + error.message;
                showNotification('registration-message');
            }
        } else {
            // Display registration error message
            document.getElementById('registration-message').textContent = response.message;
            showNotification('registration-message');
        }
    }).catch(function (error) {
        document.getElementById('registration-message').textContent = 'An error occurred during registration: ' + error;
        showNotification('registration-message');
        console.log("error while registring: ", error)
    });


    } else {
        if (!dataProtectionCheckbox.checked) {
            document.getElementById('registration-message').textContent = 'Debe aceptar la protección de datos para registrarse.';
            showNotification('registration-message');
        }
        form.reportValidity();
    }
  });

  async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission
    
    const form = event.target;
    const usernameInput = form.username;
    const passwordInput = form.password;
    const loginMessage = document.getElementById('login-message');

    // Clear previous error messages
    loginMessage.textContent = '';
    
    // Validate form fields
    if (!usernameInput.value || !passwordInput.value) {
        if (!usernameInput.value) {
            loginMessage.textContent += 'Por favor, introduce tu nombre de usuario. ';
        }
        if (!passwordInput.value) {
            loginMessage.textContent += 'Por favor, introduce tu contraseña.';
        }
        return; // Exit if validation fails
    }

    // Check server status (proxy server)
    let serverIsOnline = await checkServerStatus();
    if (!serverIsOnline) {
        loginMessage.textContent = 'Server is unavailable. Please try again later.';
        return;
    }
    try {
        await loginUser(usernameInput.value, passwordInput.value);
        document.location = './selection.html';
    } catch (error) {
        document.getElementById('login-message').textContent = '' + error;
    }
}

  
// Toggle between Login and Registration form
function toggleForm() {
    const loginContainer = document.querySelector('.login-card');
    const registrationContainer = document.querySelector('.register-card');

    const loginDisplay = window.getComputedStyle(loginContainer).display;
    const registrationDisplay = window.getComputedStyle(registrationContainer).display;

    loginContainer.style.display = loginDisplay === 'none' ? 'block' : 'none';
    registrationContainer.style.display = registrationDisplay === 'none' ? 'block' : 'none';
}

// Function to enable or disable buttons based on server status
function toggleButtons(isEnabled) {
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');

    if (isEnabled) {
        loginButton.disabled = false;
        registerButton.disabled = false;
    } else {
        loginButton.disabled = true;
        registerButton.disabled = true;
    }
}

function togglePasswordVisibility(inputId, toggleElement) {
    var passwordInput = document.getElementById(inputId);
    var toggleButton = toggleElement.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    }
}

function getUsername() {
    return $('#username')[0].value
}



async function loginUser(username, password) {
    // Emit a login request to the proxy server
    socket.emit('loginRequest', { username: username, password: password });

    // Create a promise to wait for the response from the server
    return new Promise((resolve, reject) => {
        socket.once('loginResponse', function (response) {
            if (response.success === true) {

                // Show the modal
                const modal = document.getElementById('setup-modal');
                modal.style.display = 'block';

                let session = response.params.session;

                console.log("session:: ", session)

                let spinnerDelay = 10000; // 10 seconds
                if (session === '1') {
                    spinnerDelay = 2000; // 2 seconds
                }

                console.log("----------------")
                console.log("----------------")
                console.log(response.params)
                console.log("----------------")

                // Save login information locally
                setUsername(username)
                // loginInfo.username = username;
                setSession(response.params.session)
                setExperimentName(response.params.experimentName)
                setGroupDefinition(response.params.groupDefinition)
                console.log("SETTING THE PROFILE TO:: ", response.params.userProfile)
                setUserProfile(response.params.userProfile)
                saveLoginInfo();
                // Delay for 10 seconds before resolving
                setTimeout(() => {
                    modal.style.display = 'none'; // Hide modal after setup
                    resolve(response);
                }, spinnerDelay); // Wait 10 seconds for setup
                // resolve(response); // Login successful
            } else {
                reject(response.message); // Login failed, return the error message
            }
        });
    });
}



// $('#register').on('click', async function () {
//     // Obtain form values
//     var username = $('#reg-username')[0].value;
//     var password = $('#reg-password')[0].value;
//     var password2 = $('#reg-password2')[0].value;
    
//     // Validate form fields
//     if (!username || !password || !password2) {
//         document.getElementById('registration-message').textContent = 'Por favor, completa todos los campos';
//         return;
//     }

//     // Check server status (proxy server)
//     let serverIsOnline = await checkServerStatus();
//     if (!serverIsOnline) {
//         document.getElementById('registration-message').textContent = 'Proxy server is unavailable. Please try again later.';
//         return;
//     }

//     // Register the user through the proxy server
//     socket.emit('registerRequest', { username: username, password: password, password2: password2 });

//     var registerPromise = new Promise(function (resolve, reject) {
//         socket.once('registerResponse', function (response) {
//             resolve(response);
//         });
//     });

//     registerPromise.then(async function (response) {
//         if (response.success === true) {
//             try {
//                 await loginUser(username, password);
//                 document.location = './selection.html';
//             } catch (error) {
//                 document.getElementById('registration-message').textContent = 'Error during login after registration: ' + error.message;
//             }
//         } else {
//             // Display registration error message
//             document.getElementById('registration-message').textContent = response.message;
//         }
//     }).catch(function (error) {
//         document.getElementById('registration-message').textContent = 'An error occurred during registration: ' + error;
//     });
// });



// $('#login').on('click', async function () {
//     var username = $('#username')[0].value;
//     var password = $('#password')[0].value;

//     if (!username || !password) {
//         document.getElementById('login-message').textContent = 'Por favor, escriba su usuario y contraseña para iniciar sesión.';
//         return;
//     }

//     let serverIsOnline = await checkServerStatus();
//     if (!serverIsOnline) {
//         document.getElementById('registration-message').textContent = 'Proxy server is unavailable. Please try again later.';
//         return;
//     }

//     try {
//         await loginUser(username, password);
//         document.location = './selection.html';
//     } catch (error) {
//         document.getElementById('login-message').textContent = error || 'An error occurred during login.';
//     }
// });

$('#username')[0].value = loadLoginInfo().username
