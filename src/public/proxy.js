const { createServer } = require("http")
const { Server } = require("socket.io")
const { io } = require("socket.io-client")
const fs = require('fs');

const HOST = '158.42.185.67',
    PORT = '9999'

function writeToLogFile(message) {
    const logFilePath = 'proxy.log';
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`, 'utf8');
}

function log(m) {
    writeToLogFile(m)
    console.log(m)
}

let connection = false

console.log("[PROXY]: Creating server")
const httpServer = createServer({
    // key:  readFileSync(path + "server.key"),
    // cert: readFileSync(path + "server.crt")
});
console.log("[PROXY]: Server created")

this.io = new Server(httpServer, { cors: { origin: "*" } })
httpServer.listen(8000)
console.log("[PROXY]: Server Listenning port 8000")

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
        log('Connection established to server.')
        connection = true
    })

    newsocket.on('connect_error', (socket) => {
        log('Couldn\'t connect to server.')
    })

    newsocket.on('mutation', (mutation, value) => {
        socket.emit('mutation', mutation, value)
        log(`${id} <-- ${mutation} = ${value}`)
    })

    newsocket.on('location', (location, value) => {
        socket.emit('location', location, value)
        log(`${id} <-- ${location} = ${value}`)
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

    newsocket.on('setExperimentSession', (value) => {
        socket.emit('setExperimentSession', value)
    })

    newsocket.on('disconnect', () => {
        socket.disconnect()
        connection = false
    })

    socket.on('click', (value) => {
        newsocket.emit('click', value)
    })

    socket.on('loginRequest', (data) => {
        // console.log("loginRequest: ", data)
        newsocket.emit('loginRequest', data)
    })
    
    socket.on('registerRequest', (data) => {
        console.log("registerRequest:: ",data)
        newsocket.emit('registerRequest', data)
    })

    newsocket.on('registerResponse', (data) => {
        socket.emit('registerResponse', data);
    });    

    newsocket.on('loginResponse', (data) => {
        // console.log("loginResponse: ", data)
        socket.emit('loginResponse', data)
    })

    socket.on('scroll', (value) => {
        newsocket.emit('scroll', value)
    })

    socket.on("updateName", (value) => {
        newsocket.emit("updateName", value)
    })
    
    socket.on("askForAgent", (value) => {
        newsocket.emit("askForAgent", value)
    })
})


httpServer.on("request", (req, res) => {
    if (req.url === "/check-status" && req.method === "GET") {
        // Respond with a success status
        if (connection) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "OK" }));
        } else {
            res.writeHead(505, { "Content-Type": "application/json" });
            res.end("Server Down");
        }
    }
});


