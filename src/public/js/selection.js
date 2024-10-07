function updateSelectionPage() {
    const username = loginInfo.username;
    const session = loginInfo.session;
    const groupDefinition = loginInfo.groupDefinition;
    const catalogues_completed = loginInfo.catalogues_completed;

    if (username) {
        document.getElementById('username').textContent = username;
    }

    console.log("THE GROUP DEFFF:: ", groupDefinition)

    if (groupDefinition) {
        document.querySelector("#card2 div img").src = getDomainImageSource(groupDefinition.session1.domain);
        document.querySelector("#card3 div img").src = getDomainImageSource(groupDefinition.session2.domain);
        
        document.querySelector("#card2 div.title").textContent = groupDefinition.session1.domain;
        document.querySelector("#card3 div.title").textContent = groupDefinition.session2.domain;

    
    }

    if (session) {
        document.getElementById('session_id').textContent = session;
        if (session === "1"){
            document.getElementById('session_text').textContent = "Learning (Human Feedback)";
            enableCard("card1")
            disableCard("card2")
            disableCard("card3")
            console.log("catalogues, completed:: ", catalogues_completed)

        }else if (session === "2"){
            document.getElementById('session_text').textContent = groupDefinition.session1.domain;
            disableCard("card1")
            enableCard("card2")
            disableCard("card3")
        }
        else if (session === "3"){

            document.getElementById('session_text').textContent = groupDefinition.session2.domain;
            disableCard("card1")
            disableCard("card2")
            enableCard("card3")
        }
        
        addCardClickEvents(groupDefinition)
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
function addCardClickEvents(groupDefinition) {
    document.getElementById("card1").onclick = function() {
        document.location = 'http://158.42.185.67:8000/login_web';
    };

    document.getElementById("card2").onclick = function() {
        mc.mutate("category", groupDefinition.session1.domain.toLowerCase())
        askForAgent(groupDefinition.session1.method)
        // document.location = 'catalog.html';
    };

    document.getElementById("card3").onclick = function() {
        mc.mutate("category", groupDefinition.session2.domain.toLowerCase())
        askForAgent(groupDefinition.session2.method)
        // document.location = 'catalog.html';
    };
}

window.onload = updateSelectionPage();
