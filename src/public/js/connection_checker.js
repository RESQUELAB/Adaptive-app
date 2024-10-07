
function checkServerStatus() {
    document.getElementById('server-indicator_text').textContent = 'Connecting...';
    document.getElementById('server-indicator').classList.remove("connected");
    document.getElementById('refresh-button').classList.add("connecting");
    const currentPage = window.location.pathname;

    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/check-status')
            .then(response => {
                if (response.ok) {
                    document.getElementById('server-indicator_text').textContent = 'Connected';
                    document.getElementById('server-indicator').classList.add("connected");
                    document.getElementById('refresh-button').classList.remove("connecting");
                    if (currentPage === '/' || currentPage.includes('index.html')) {
                        toggleButtons(true);
                    }
                    resolve(true);  // Server is online
                } else {
                    console.log("nope. Server is off.")
                    document.getElementById('server-indicator_text').textContent = "Server is down. Try again later";
                    document.getElementById('refresh-button').classList.remove("connecting");
                    if (currentPage === '/' || currentPage.includes('index.html')) {
                        toggleButtons(false);
                    }
                    resolve(false);  // Server is down
                }
            })
            .catch(error => {
                console.log("nope. Proxy is off.")
                document.getElementById('server-indicator_text').textContent = 'Proxy is off. Launch it first.';
                document.getElementById('refresh-button').classList.remove("connecting");
                console.error('Error while checking server status:', error);
                if (currentPage === '/' || currentPage.includes('index.html')) {
                    toggleButtons(false);
                }
                resolve(false);  // Error means server is offline
            });
    });
}

window.onload = async function () {
    const currentPage = window.location.pathname;
    const serverIsOnline = await checkServerStatus();
    if (currentPage === '/' || currentPage.includes('index.html')) {
        toggleButtons(serverIsOnline);
    }
};

