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

    // Take them off the list
    delete RandomMatchList[this.client.username]
    delete RandomMatchList[opponent.username]

    this.settleWith(opponent)
}

/**
 * Sets the two players together for a game.
 * @param {Object} opponent
 */
RandomMatcher.prototype.settleWith = function (opponent) {
    // If one of them already found a game, abort
    if (!this.client.RandomMatcher || !opponent.RandomMatcher) {
        return
    }

    opponent.RandomMatcher.found()

    // Clean up matcher data so system doesn't match them with someone else
    delete this.client.RandomMatcher
    delete opponent.RandomMatcher

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
RandomMatcher.prototype.found = function () {
    var matcher = this

    if (this.timeout) {
        clearTimeout(this.timeout)
    }
}

// Event handler
require('event-emitter')(RandomMatcher.prototype)

module.exports = RandomMatcher
