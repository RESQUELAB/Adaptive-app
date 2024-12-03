
function updateSelectionPage() {
    const username = loginInfo.username;
    const session = loginInfo.session;
    let groupDefinition = loginInfo.groupDefinition;
    const catalogues_completed = loginInfo.catalogues_completed;

    const cataloge_1_finished = loginInfo.catalogue_1
    const cataloge_2_finished = loginInfo.catalogue_2
    const survey_1_finished = loginInfo.survey_1
    const survey_2_finished = loginInfo.survey_2

    let experiment_finished = false;

    let flags = {
        catalogue_1: cataloge_1_finished,
        catalogue_2: cataloge_2_finished,
        survey_1: survey_1_finished,
        survey_2: survey_2_finished,
    }

    if (username) {
        document.getElementById('username').textContent = username;
    }

    if (groupDefinition) {
        document.querySelector("#card2 div img").src = getDomainImageSource(groupDefinition.session1.domain);
        document.querySelector("#card3 div img").src = getDomainImageSource(groupDefinition.session2.domain);
        
        document.querySelector("#card2 div.title").textContent = groupDefinition.session1.domain;
        document.querySelector("#card3 div.title").textContent = groupDefinition.session2.domain;

    
    }

    if (session) {
        if (session === "1"){
            enableCard("card1")
            disableCard("card2")
            disableCard("card3")
            console.log("catalogues, completed:: ", catalogues_completed)

        }else if (session === "2") {
            disableCard("card1");

        
            if (!cataloge_1_finished && !survey_1_finished) {
                // 1 - Enable card 2 with the Catalogue image and domain text
                enableCard("card2");
                disableCard("card3");
                document.querySelector("#card2 div.title").textContent = groupDefinition.session1.domain;        
            } else if (cataloge_1_finished && !survey_1_finished) {
                // 2 - Enable card 2 with the domain and questionnaire
                enableCard("card2");
                disableCard("card3");
                document.querySelector("#card2 div.title").textContent = "Survey for " + groupDefinition.session1.domain;
        
            } else if (cataloge_1_finished && survey_1_finished) {
                if (!cataloge_2_finished && !survey_2_finished) {
                    // 3 - Enable card 3 (and disable card2) with the Catalogue image and domain text
                    disableCard("card2");
                    enableCard("card3");
                    document.querySelector("#card3 div.title").textContent = groupDefinition.session2.domain;
        
                } else if (cataloge_2_finished && !survey_2_finished) {
                    // 4 - Enable card 3 with the domain and questionnaire
                    disableCard("card2");
                    enableCard("card3");
                    document.querySelector("#card3 div.title").textContent = "Survey for " + groupDefinition.session2.domain;
                } else if (cataloge_2_finished && survey_2_finished) {
                    // Both catalogue 2 and survey 2 are finished
                    enableCard("card2");
                    enableCard("card3");
                    experiment_finished = true
                }
            }
        }

        changeDescription(session, groupDefinition, flags)

        if(experiment_finished){
            groupDefinition.session1.method = "Non-Adaptive";
            groupDefinition.session2.method = "Non-Adaptive";

            flags = {
                catalogue_1: false,
                catalogue_2: false,
                survey_1: true,
                survey_2: true,
            }

        }
        addCardClickEvents(groupDefinition, flags)
        
    }
}


function changeDescription(session, groupDefinition, flags) {
    const descriptionElement = document.querySelector('.description-text p');
    
    const warning_paragraph = document.getElementById('warning-message');

    warning_paragraph.style.display = "none";

    if (session === "1") {
        descriptionElement.innerHTML = `
            Estás en la <strong>Sesión 1</strong>. 
            Solo está disponible la tarea de <b>Learning (Human Feedback)</b>. 
            Por favor, completa esta actividad antes de pasar a la siguiente sesión.
        `;
    } else if (session === "2") {
        descriptionElement.innerHTML = `Estás en la <strong>Sesión 2</strong>.`;

        if (!flags.catalogue_1 && !flags.survey_1) {
            descriptionElement.innerHTML += `
                Tarea actual: Debes completar el catálogo de <strong>${groupDefinition.session1.domain}</strong>. 
                Una vez finalizado, se habilitará el cuestionario correspondiente.
            `;
        } else if (flags.catalogue_1 && !flags.survey_1) {
            descriptionElement.innerHTML += `
                Tarea actual: El catálogo de <strong>${groupDefinition.session1.domain}</strong> está completo. 
                Ahora, debes rellenar el cuestionario correspondiente.
            `;
        } else if (flags.catalogue_1 && flags.survey_1) {
            if (!flags.catalogue_2 && !flags.survey_2) {
                descriptionElement.innerHTML += `
                    El primer dominio (<strong>${groupDefinition.session1.domain}</strong>) está completo. 
                    Ahora debes completar el catálogo de <strong>${groupDefinition.session2.domain}</strong>.
                `;
            } else if (flags.catalogue_2 && !flags.survey_2) {
                descriptionElement.innerHTML += `
                    El segundo dominio (<strong>${groupDefinition.session2.domain}</strong>) está completo. 
                    Por favor, rellena el cuestionario correspondiente.
                `;
            } else if (flags.catalogue_2 && flags.survey_2) {
                descriptionElement.innerHTML += `
                    ¡Ambos dominios y cuestionarios están completos! 
                    <strong>Muchas gracias por participar en el experimento.</strong>

                    <p style= "margin-top: 30px">
                        Se han dejado ambos catalogos disponibles para su uso. Por si queréis seguir usándolo.
                    </p>
                `;
            }
        }
    }
}


function getDomainImageSource(domain) {
    // This function can map the domain names to specific image paths
    const domainImageMap = {
        "Courses": "./img/logo_courses.png",
        "Trips": "./img/logo_trips.png"
    };

    // Return the image path for the corresponding domain or a default image if not found
    return domainImageMap[domain] || "./img/logo.png";
}

// Enable a specific card
function enableCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.remove("disabled");
    card.style.pointerEvents = "auto";
    card.style.opacity = "1";
}

// Disable a specific card
function disableCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.add("disabled");
    card.style.pointerEvents = "none";
    card.style.opacity = "0.5";
}


// Add click events to the cards
function addCardClickEvents(groupDefinition, flags) {
    document.getElementById("card1").onclick = function() {
        document.location = 'http://158.42.185.67:8000/login_web';
    };

    document.getElementById("card2").onclick = function() {
        mc.mutate("category", groupDefinition.session1.domain.toLowerCase())
        console.log({
            method: groupDefinition.session1.method,
            catalogue_finished: flags.catalogue_1,
        })
        askForAgent({
            method: groupDefinition.session1.method,
            catalogue_finished: flags.catalogue_1,
        })
        // document.location = 'catalog.html';
    };

    document.getElementById("card3").onclick = function() {
        mc.mutate("category", groupDefinition.session2.domain.toLowerCase())
        console.log({
            method: groupDefinition.session2.method,
            catalogue_finished: flags.catalogue_2,
        })
        askForAgent({
            method: groupDefinition.session2.method,
            catalogue_finished: flags.catalogue_2,
        })
        // document.location = 'catalog.html';
    };
}

window.onload = updateSelectionPage();
