// Player
const Player = require('./Game/Player')

// Socket.io instance
const IO = require('../bootstrap/socket')

IO.on('connect', socket => {
    socket.player = new Player(socket)

    socket.on('start', require('./listeners/start'))
})