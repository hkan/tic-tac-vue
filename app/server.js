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
| Leaderboard
|--------------------------------------------------------------------------
*/

var Leaderboard = require('./Leaderboard')

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
*/

var Game = require('./Game')

// Start HTTP Server
http.listen(ENV.SOCKET_PORT)

// Socket.IO middleware for authentication
io.use(function (socket, next) {
    var params = socket.handshake.query

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

function findByUsername(username) {
    return _.find(io.nsps['/'].sockets, function (client) {
        return client.username == username
    })
}

function startGame(socket, opponent) {
    if (!opponent) {
        return false
    }

    if (opponent.game) {
        return false
    }

    var game = new Game(socket, opponent)

    game.on('ready', function () {
        socket.game = game
        opponent.game = game

        socket.opponent = opponent
        opponent.opponent = socket

        // tell both parties about the game
        socket.emit('game', { opponent: { id: opponent.id.replace('/#', ''), username: opponent.username }, game: opponent.gameRoom, starts: true })
        opponent.emit('game', { opponent: { id: socket.id.replace('/#', ''), username: socket.username }, game: opponent.gameRoom, starts: false })
    })

    game.on('turn-switched', function (client) {
        io.to(game.room)
            .emit('turn', { username: client.username })
    })

    game.on('cell-checked', function (row, column, client) {
        game.switchTurn()

        io.to(game.room)
            .emit('played', { row: row, column: column, username: client.username })
    })

    game.on('room-created', function (roomName) {
        // Join both parties into the room
        socket.join(roomName)
        opponent.join(roomName)
    })

    game.on('destroy', function () {
        // TODO: let users about abort

        // Clean up both player's game info
        game.home().opponent = null
        game.away().opponent = null

        game.home().started = false
        game.away().started = false
    })

    game.init()

    return true
}

// New socket client
io.on('connection', function (socket) {

    // Send the leaderboard data to the client
    socket.emit('leaderboard-data', Leaderboard.current())

    Leaderboard.on('update', function (data) {
        socket.emit('leaderboard-data', data)
    })

    socket.on('disconnect', function () {
        if (socket.game) {
            socket.game.destroy()
        }
    })

    // User checked one of the cells
    socket.on('play', function (row, column) {
        if (!socket.game) {
            return
        }

        //try {
            socket.game.check(row, column)

            socket.broadcast.to(socket.game.room)
                .emit('opponent-played', { row: row, column: column })
        // } catch (e) {
        //     console.log(e)

        //     // TODO: implement fail handler on front end
        //     socket.emit('play-failed', { row: row, column: column })
        // }
    })

    socket.on('register', function (data) {
        if (socket.username && socket.username.length) {
            socket.emit('register-failed', 'Already registered.')
            return
        }

        var regExp = new RegExp(/^[a-zA-Z0-9]+$/g)

        if (! regExp.test(data.username)) {
            socket.emit('register-failed', 'Invalid username.')
            return
        }

        var client = findByUsername(data.username)

        if (client) {
            socket.emit('register-failed', 'User exists.')
            return
        }

        socket.username = data.username
        socket.emit('registered')
    })

    /**
     * When user requests to match with a specific user.
     *
     * @param {string} username Given username to find the user
     */
    socket.on('match-with', function (username) {
        var opponent = findByUsername(username)

        if (!opponent) {
            socket.emit('match-failed', 'User not available.')
            return
        }

        if (opponent.username == socket.username) {
            socket.emit('match-failed', 'User is you.')
            return
        }

        // Opponent is already in a game
        if (opponent.gameRoom) {
            socket.emit('match-failed', 'User is currently playing.')
            return
        }

        opponent.gotMatchRequestedBy = socket

        socket.emit('matched')
        opponent.emit('match-request', {username: socket.username})
    })

    socket.on('match-deny', function () {
        var opponent = socket.gotMatchRequestedBy

        if (!opponent) {
            return
        }

        // Clean up match request
        delete socket.gotMatchRequestedBy

        opponent.emit('match-denied')
    })

    /**
     * When user confirms the incoming match request.
     */
    socket.on('match-confirm', function () {
        var opponent = socket.gotMatchRequestedBy

        if (!opponent) {
            socket.emit('match-confirm-failed')
            return
        }

        // Clean up match request
        delete socket.gotMatchRequestedBy

        socket.matched = opponent
        opponent.matched = socket

        socket.emit('match-successful')
        opponent.emit('match-successful')
    })

    /**
     * When one of the clients is ready to begin the game.
     */
    socket.on('ready-to-begin', function () {
        var opponent = socket.matched

        // No opponents? No game...
        if (!opponent) {
            return
        }

        // If opponent's ready, game can start immediately
        if (opponent.readyToBegin) {
            // Clean up the match info
            delete socket.readyToBegin
            delete socket.matched
            delete opponent.readyToBegin
            delete opponent.matched

            // Start the game
            startGame(socket, opponent)

            // Stop event execution here
            return
        }

        // Mark this client as ready to begin and wait for opponent
        socket.readyToBegin = true
    })

    /**
     * User wants to play again.
     */
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

    /**
     * The game has ended so we update the leaderboard.
     */
    socket.on('game-over', function (won) {
        if (!socket.opponent) {
            return
        }

        if (won) {
            Leaderboard.won(socket.username)
            Leaderboard.lost(socket.opponent.username)
        } else {
            Leaderboard.lost(socket.username)
            Leaderboard.won(socket.opponent.username)
        }
    })
})
