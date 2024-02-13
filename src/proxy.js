const { createServer } = require("http")
const { Server } = require("socket.io")
const { io } = require("socket.io-client")

const HOST = '192.168.0.135',
	  PORT = '9999'

function log(m) {
    console.log(m)
}

const httpServer = createServer({
    // key:  readFileSync(path + "server.key"),
    // cert: readFileSync(path + "server.crt")
});
  
this.io = new Server(httpServer, { cors: {origin:"*"} })
httpServer.listen(8000)

log("proxy on!")


this.io.on("connection", (socket) => {
    let auth = socket.handshake.auth
    auth.sessionID = auth.sessionID || ''
    auth.page = auth.page || ''
    let id = `${auth.sessionID.substr(0,8)} (${auth.username})`

    log(`${id} --> ${auth.page}`)

    const newsocket = io( `http://${HOST}:${PORT}` , {
        reconnection: false,
        auth: {
            sessionID: auth.sessionID,
            username: auth.username,
            page: auth.page,
            mutations: auth.mutations
        },
        cors: {origin:"*"}
    })
    

    newsocket.on('connect', (socket) => {
        //log('Connection established to server.')
        
    })
    
    newsocket.on('connect_error', (socket) => {
        //log('Couldn\'t connect to server.')
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
    })

    socket.on('click', (value) => {
        newsocket.emit('click', value)
    })
    
    socket.on('scroll', (value) => {
        newsocket.emit('scroll', value)
    })
})




