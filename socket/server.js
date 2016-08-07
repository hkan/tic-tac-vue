// Environment variables
var ENV = require('node-env-file')(__dirname + '/../.env')

// Underscore.js
var _ = require('underscore')

// HTTP Server
var app = require('express')()
var http = require('http').Server(app)

// Socket.io
var io = require('socket.io')(http)

/*
 |--------------------------------------------------------------------------
 | Application
 |--------------------------------------------------------------------------
 */

// Start HTTP Server
http.listen(ENV.SOCKET_PORT)

// Socket.IO middleware for authentication
io.use(function (socket, next) {
    var params = socket.handshake.query

    if (params.opponent) {
        socket.opponent = params.opponent
    }

    next()
})

/*
 |--------------------------------------------------------------------------
 | Client events
 |--------------------------------------------------------------------------
 */

io.on('connection', function (socket) {
    var idClean = socket.id.replace('/#', ''),
        room = 'room-' + idClean

    socket.join('room-' + idClean)

    // This client is supposed to be an opponent to an existing game
    if (socket.opponent) {
        room = 'room-' + socket.opponent
        socket.join(room)
        io.to(room).emit('opponent-connected', {id: socket.id.replace('/#', '')})
    }

    socket.on('play', function (row, column) {
        socket.broadcast.to(room)
            .emit('opponent-played', {row:row, column:column})
    })
})
