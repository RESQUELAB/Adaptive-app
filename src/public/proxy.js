const { createServer } = require("http")
const { Server } = require("socket.io")
const { io } = require("socket.io-client")

const HOST = '158.42.185.67',
    PORT = '9999'

function log(m) {
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
            mutations: auth.mutations
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

    newsocket.on('setSessionID', (value) => {
        socket.emit('setSessionID', value)
    })

    newsocket.on('disconnect', () => {
        socket.disconnect()
        connection = false
    })

    socket.on('click', (value) => {
        newsocket.emit('click', value)
    })

    socket.on('loginRequest', (data) => {
        console.log("loginRequest: ", data)
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
        console.log("loginResponse: ", data)
        socket.emit('loginResponse', data)
    })

    socket.on('scroll', (value) => {
        newsocket.emit('scroll', value)
    })

    socket.on("updateName", (value) => {
        newsocket.emit("updateName", value)
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


