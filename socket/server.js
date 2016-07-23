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
    socket.join('room-' + socket.id.replace('/#', ''))

    if (socket.opponent) {
        socket.join('room-' + socket.opponent)
        io.to('room-' + socket.opponent).emit('opponent', {id:socket.id.replace('/#', '')})
    }

    socket.on('play', function (row, column) {
        socket.broadcast.to('room-' + (socket.opponent || socket.id.replace('/#', ''))).emit('play', {row:row, column:column})
    })
})
