const { http } = require('./http')

// Socket.io
const io = require('socket.io')(http)

module.exports = io
