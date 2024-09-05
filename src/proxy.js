const process = require('process');
const fs = require('fs');

function writeToLogFile(message) {
    const logFilePath = 'proxy.log';
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`, 'utf8');
}

function log(m) {
    writeToLogFile(m)
    console.log(m)
}


// Example usage
log('STARTED THE PROXY SCRIPT');


const { createServer } = require("http")
const { Server } = require("socket.io")
const { io } = require("socket.io-client")

const HOST = '158.42.185.67',
    PORT = '9999'


let connection = false

log("[PROXY]: Creating server")
const httpServer = createServer({
    // key:  readFileSync(path + "server.key"),
    // cert: readFileSync(path + "server.crt")
});

this.io = new Server(httpServer, { cors: { origin: "*" } })
httpServer.listen(8000)
log("[PROXY]: Server Listenning port 8000")

log("proxy on!")


this.io.on("connection", (socket) => {

    let auth = socket.handshake.auth
    auth.sessionID = auth.sessionID || ''
    auth.page = auth.page || ''
    let id = `${auth.sessionID.substr(0, 8)} (${auth.username})`

    log(`${id} --> ${auth.page}`)

    const newsocket = io(`http://${HOST}:${PORT}`, {
        reconnection: false,
        auth: {
            sessionID: auth.sessionID,
            username: auth.username,
            page: auth.page,
            mutations: auth.mutations,
            all_mutations: auth.all_mutations
        },
        cors: { origin: "*" }
    })


    newsocket.on('connect', (socket) => {
        log("CONNECTED TO SERVER: ${HOST}:${PORT}")
        connection = true
    })

    newsocket.on('connect_error', (error) => {
        log(`Couldn't connect to server: ${error.message}`);
    });

    newsocket.on('mutation', (mutation, value) => {
        socket.emit('mutation', mutation, value)
        log(`${id} <-- ${mutation} = ${value}`)
    })

    newsocket.on("getImage", (callback) => {

        socket.timeout(5000).emit("getImage", (err, response) => {
            if (err) {
                console.log("ERROR... ", err)
                // the other side did not acknowledge the event in the given delay
            } else {
                const base64Data = response.replace(/^data:image\/png;base64,/, '');
                const binaryData = Buffer.from(base64Data, 'base64');
                fs.writeFile(`test_PROXY.png`, binaryData, 'binary', (err) => {
                    if (err) throw err
                    console.log('Image Saved')
                })
                log(`${id} <-- taking screenshot`)
                callback(response);
            }
        });
    });

    newsocket.on('setSessionID', (value) => {
        socket.emit('setSessionID', value)
    })

    newsocket.on('disconnect', () => {
        socket.disconnect()
        connection = false
    })

    socket.on('updateState', (value) => {
        newsocket.emit('updateState', value)
    })

    socket.on('click', (value) => {
        newsocket.emit('click', value)
    })

    socket.on('scroll', (value) => {
        newsocket.emit('scroll', value)
    })

    socket.on("updateName", (value) => {
        newsocket.emit("updateName", value)
    })

    process.stdin.on('data', (data) => {
        // Parse the received data
        const { type, data: imageData } = JSON.parse(data.toString());
        if (type === "image") {
            // Decode the base64 string to image data
            const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
            // Write the image data to a file
            fs.writeFile(`test_from_proxy.png`, imageBuffer, (err) => {
                if (err) throw err;
            });
            newsocket.emit("sendImage", imageBuffer)
            log(`${id} <-- took screenshot`)
        }
    });
})


httpServer.on("request", (req, res) => {
    if (req.url === "/check-status" && req.method === "GET") {
        // Respond with a success status
        if (connection) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "OK" }));
        } else {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end("Server Down");
        }
    }
});
