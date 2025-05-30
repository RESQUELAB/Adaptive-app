// // Function to update HOST when the user edits the input
// function updateHostFromInput() {
//     const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}(:[0-9]{1,5})?$/;
//     const input = document.getElementById('server-host-display');
//     const newHost = input.value.trim();

//     if (newHost && IP_REGEX.test(newHost)) {
//         localStorage.setItem('server-host', newHost); // Save valid HOST
//         checkServerStatus(); // Optionally recheck server status
//     } else {
//         alert('Please enter a valid server host in the format "192.168.1.1:9999".');
//         input.value = localStorage.getItem('server-host') || ''; // Reset to last valid value
//     }
//     location.reload()
// }

// // Initialize input field on page load
// document.addEventListener('DOMContentLoaded', () => {
//     const savedHost = localStorage.getItem('server-host');
//     const input = document.getElementById('server-host-display');
//     input.value = savedHost || 'Not Set';
//     if (savedHost) {
//         checkServerStatus();
//     }
// });

// document.getElementById('server-host-display').addEventListener('input', (event) => {
//     const input = event.target;
//     const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}(:[0-9]{1,5})?$/;
//     const isValid = IP_REGEX.test(input.value.trim());
//     input.style.borderColor = isValid ? 'green' : 'red';
// });


function checkServerStatus(retryCount = 0) {
    const maxRetries = 10; 
    const retryDelay = 500;  

    const currentPage = window.location.pathname;

    console.log("the socket:: ", socket.connected)
    console.log("the socket host:: ", socket)


    // Check socket connection status
    return new Promise((resolve) => {
        if (socket.connected) {
            document.getElementById('server-indicator_text').textContent = 'Connected';
            document.getElementById('server-indicator').classList.add("connected");
            document.getElementById('refresh-button').classList.remove("connecting");
            if (currentPage === '/' || currentPage.includes('index.html')) {
                toggleButtons(true);
            }
            resolve(true);  // Server is online
        } 
        else {
            console.log("nope. Server is off.");
            document.getElementById('server-indicator_text').textContent = "Server is down. Try again later";
            document.getElementById('refresh-button').classList.remove("connecting");
            if (currentPage === '/' || currentPage.includes('index.html')) {
                toggleButtons(false);
            }
            if (retryCount < maxRetries) {
                document.getElementById('server-indicator_text').textContent = 'Connecting...';
                document.getElementById('server-indicator').classList.remove("connected");
                document.getElementById('refresh-button').classList.add("connecting");
                console.log(`Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
                setTimeout(() => {
                    checkServerStatus(retryCount + 1).then(resolve);
                }, retryDelay);
            } else {
                document.getElementById('server-indicator_text').textContent = "Server is down. Please try again later.";
                resolve(false);  // Reached max retry attempts, server is down
            }
        }
    });
}

window.onload = async function () {
    const currentPage = window.location.pathname;
    const serverIsOnline = await checkServerStatus();
    if (currentPage === '/' || currentPage.includes('index.html')) {
        toggleButtons(serverIsOnline);
    }
};

