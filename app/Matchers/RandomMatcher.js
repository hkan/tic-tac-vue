var _ = require('lodash')

/**
 * @param {Object} client The client who sends the match request.
 */
var RandomMatcher = function (client) {
    this.client = client

    // No opponent yet
    this.opponent = null

    // Add to random matching list
    RandomMatchList[client.username] = client;

    this.client.RandomMatcher = this
}

var RandomMatchList = {}

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
    delete RandomMatchList[this.client.username]
    delete RandomMatchList[opponent.username]
}

/**
 * Sets the two players together for a game.
 * @param {Object} opponent
 */
RandomMatcher.prototype.settleWith = function (opponent) {
    // If one of them already found a game, abort
    if (!RandomMatchList[this.client.username] || !RandomMatchList[opponent.username]) {
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

module.exports = RandomMatcher
