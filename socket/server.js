// Environment variables
var ENV = require('node-env-file')(__dirname + '/../.env')

// Underscore.js
var _ = require('lodash')

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

            socket.started = true
            opponent.started = false
        }
    }

    socket.on('disconnect', function () {
        if (socket.opponent) {
            socket.opponent.emit('opponent-disconnected')

            socket.opponent.gameRoom = null
            socket.opponent.opponent = null

            socket.started = false
            socket.opponent.started = false

            socket.gameRoom = null
            socket.opponent = null
        }
    })

    // User checked one of the cells
    socket.on('play', function (row, column) {
        socket.broadcast.to(socket.gameRoom)
            .emit('opponent-played', {row:row, column:column})
    })

    socket.on('register', function (data) {
        if (socket.username && socket.username.length) {
            socket.emit('register-failed', 'Already registered.')
            return
        }

        var client = _.find(io.nsps['/'].sockets, function (client) {
            if (client.id == socket.id) {
                return false
            }

            return client.username == data.username
        })

        if (client) {
            socket.emit('register-failed', 'User exists.')
            return
        }

        socket.username = data.username
        socket.emit('registered')
    })

    // User wants to play again
    socket.on('play-again', function () {
        // If opponent already confirmed to play again, start it
        if (socket.opponent && socket.opponent.wantsAgain) {
            // Start game for both
            socket.emit('restart', {starts: !socket.started})
            socket.opponent.emit('restart', {starts: !socket.opponent.started})

            socket.started = !socket.started
            socket.opponent.started = !socket.opponent.started

            // Reset statuses
            socket.wantsAgain = false
            socket.opponent.wantsAgain = false
            return
        }

        socket.wantsAgain = true

        socket.broadcast.to(socket.gameRoom)
            .emit('opponent-wants-again')
    })
})
