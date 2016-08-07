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
        socket.opponent = findClient(params.opponent)
    }

    next()
})

/*
 |--------------------------------------------------------------------------
 | Client events
 |--------------------------------------------------------------------------
 */

function findClient(id) {
    if (id.substr(0, 2) != '/#') {
        id = '/#' + id
    }

    return io.nsps['/'].sockets[id]
}

function startGame(socket, opponent) {
    if (!opponent) {
        return false
    }

    if (opponent.gameRoom) {
        return false
    }

    // Create a new room
    room = 'game-' + Date.now()

    // Join both parties into the room
    socket.join(room)
    opponent.join(room)

    socket.opponent = opponent
    opponent.opponent = socket

    opponent.gameRoom = room
    socket.gameRoom = room

    return true
}

// New socket client
io.on('connection', function (socket) {

    // This client is supposed to be an opponent to an existing game
    if (socket.opponent) {
        var opponent = socket.opponent,
            started = startGame(socket, opponent)

        if (!started) {
            socket.emit('game-failed')
        } else {
            // tell both parties about the game
            socket.emit('game', {opponent: opponent.id.replace('/#', ''), game: opponent.gameRoom, starts: true})
            opponent.emit('game', {opponent: socket.id.replace('/#', ''), game: opponent.gameRoom, starts: false})
        }
    }

    socket.on('disconnect', function () {
        if (socket.opponent) {
            socket.opponent.emit('opponent-disconnected')

            socket.opponent.gameRoom = null
            socket.opponent.opponent = null

            socket.gameRoom = null
            socket.opponent = null
        }
    })

    // User checked one of the cells
    socket.on('play', function (row, column) {
        socket.broadcast.to(room)
            .emit('opponent-played', {row:row, column:column})
    })

    // User wants to play again
    socket.on('play-again', function () {
        socket.broadcast.to(room)
            .emit('opponent-wanna-play-again')
    })
})
