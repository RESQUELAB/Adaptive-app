
function checkServerStatus(retryCount = 0) {
    const maxRetries = 10;  // You can adjust the number of retry attempts
    const retryDelay = 500;  // Retry every 3 seconds

    const currentPage = window.location.pathname;

    console.log("the socket:: ", socket.connected)


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

