var _ = require('lodash')

/**
 * @param {Object} client The client who sends the match request.
 */
var RandomMatcher = function (client) {
    this.client = client

    // No opponent yet
    this.opponent = null

    // Add to random matching list
    RandomMatchList.add(client)

    this.client.RandomMatcher = this
}

var RandomMatchList = {
    all: {},

    add: function (client) {
        RandomMatchList.all[client.username] = client
        RandomMatcher.emit('pool-updated')
    },

    remove: function (client) {
        delete RandomMatchList.all[client.username]
        RandomMatcher.emit('pool-updated')
    },
}

/*
|------------------------------------------------------------------------------
| Class methods
|------------------------------------------------------------------------------
*/

RandomMatcher.poolCount = function () {
    return Object.keys(RandomMatchList.all).length
}

/*
|------------------------------------------------------------------------------
| Instance methods
|------------------------------------------------------------------------------
*/

/**
 * Sends the request
 */
RandomMatcher.prototype.search = function () {
    var opponent = this.findOpponent()

    if (!opponent) {
        this.timeout = setTimeout(this.search.bind(this), 3000)
        return
    }

    this.settleWith(opponent)

    // Take them off the list
    RandomMatchList.remove(this.client)
    RandomMatchList.remove(opponent)
}

/**
 * Sets the two players together for a game.
 * @param {Object} opponent
 */
RandomMatcher.prototype.settleWith = function (opponent) {
    // If one of them already found a game, abort
    if (!RandomMatchList.all[this.client.username] || !RandomMatchList.all[opponent.username]) {
        return
    }

    this.opponent = opponent
    this.client.opponent = opponent
    opponent.RandomMatcher.found(this.client)

    this.emit('ready', opponent)
}

/**
 * Searches for players.
 */
RandomMatcher.prototype.findOpponent = function () {
    var matcher = this

    return _.find(RandomMatchList, function (socket) {

        // If not looking for random players anymore...
        if (!socket.RandomMatcher) {
            return false
        }

        // Cannot match with themselves
        if (socket.username == matcher.client.username) {
            return false
        }

        return true
    })
}

/**
 * Searches for players.
 */
RandomMatcher.prototype.found = function (opponent) {
    this.client.opponent = opponent
    this.opponent = opponent
    this.emit('ready', opponent)

    if (this.timeout) {
        clearTimeout(this.timeout)
    }
}

/**
 * Ready to start
 */
RandomMatcher.prototype.ready = function (socket) {
    var opponent = socket.id == this.client.id ? this.opponent : this.client

    // If opponent's ready, game can start immediately
    if (opponent.readyToBegin) {
        // Clean up the match info
        delete this.client.readyToBegin
        delete this.opponent.readyToBegin

        this.emit('completed', this.opponent)

        // Stop event execution here
        return
    }

    socket.readyToBegin = true
}

// Event handler
require('event-emitter')(RandomMatcher.prototype)
require('event-emitter')(RandomMatcher)

module.exports = RandomMatcher
