


async function sendSurvey(surveyResponses) {
    socket.emit('surveyResponse', surveyResponses);
    // Create a promise to wait for the response from the server
    return new Promise((resolve, reject) => {
        socket.once('surveyResponseAcknowledgment', function (response) {
            if (response.success === true) {
                // Save login information locally
                if(!loginInfo.survey_1){
                    setSurvey_1_finished()
                }else if(!loginInfo.survey_2){
                    setSurvey_2_finished()
                }
                resolve(response); 
            } else {
                reject(response.message);
            }
        });
    });
}


async function handleSurvey(event) {
    event.preventDefault(); 
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true; // Disable the button


    console.log("CLICKED ON THE SUBMIT!!!")

    const form = event.target;
    if (form.checkValidity()) {
        console.log("Form is valid, submitting...");

        var surveyResponses = {};
        
        var inputs = form.querySelectorAll('input[type="radio"]');

        inputs.forEach(function(input) {
            if (input.checked) {
                surveyResponses[input.name] = input.value;
            }
        });
        console.log(surveyResponses)

        try {
            await sendSurvey(surveyResponses);
            document.location = './selection.html';
        } catch (error) {
            console.log("Error...", error);
            submitButton.disabled = false; // Re-enable the button on error
        }
    } else {
        form.reportValidity();
        submitButton.disabled = false; // Re-enable if form is invalid
    }
}


function clearAnswer(name) {
    const radios = document.getElementsByName(name);
    for (let radio of radios) {
        radio.checked = false;
    }
}