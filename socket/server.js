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

    if (params.id) {
        socket.opponent = params.id
    }

    next()
})

/*
 |--------------------------------------------------------------------------
 | Client events
 |--------------------------------------------------------------------------
 */

io.on('connection', function (socket) {
    if (socket.opponent) {
        socket.join('/#' + socket.opponent)
        socket.to(socket.opponent).emit('opponent', {id:socket.id})
    }

    socket.on('play', function (data) {

    })
})
