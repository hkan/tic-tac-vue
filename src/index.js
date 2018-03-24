// Player
const Player = require('./Game/Player')

// Socket.io instance
const IO = require('../bootstrap/socket')

IO.on('connect', socket => {
    socket.player = new Player(socket)

    socket.on('disconnect', require('./listeners/disconnect'))
    socket.on('register', require('./listeners/register'))
    socket.on('request-game', require('./listeners/request-game'))
    socket.on('start', require('./listeners/start'))
})