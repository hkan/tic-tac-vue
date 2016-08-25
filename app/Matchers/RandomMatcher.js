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
RandomMatcher.prototype.sendRequest = function () {
    var opponent = this.search()

    if (!opponent) {
        setTimeout(this.sendRequest, 3000)
        return
    }

    // Take them off the list
    delete RandomMatchList[this.client.username]
    delete RandomMatchList[opponent.username]

    this.settleWith(opponent)

    // search for opponents
    // if not found any, wait 3 secs and search again
    // if found, start their game
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

    // Clean up matcher data so system doesn't match them with someone else
    delete this.client.RandomMatcher
    delete opponent.RandomMatcher

    this.opponent = opponent
}

/**
 * Searches for players.
 */
RandomMatcher.prototype.search = function () {
    return _.find(RandomMatcher.list, function (socket) {
        if (!socket.RandomMatcher) {
            return false
        }

        return true
    })
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
        delete this.client.matched
        delete this.opponent.readyToBegin
        delete this.opponent.matched

        this.emit('completed')

        // Stop event execution here
        return
    }

    socket.readyToBegin = true
}

// Event handler
require('event-emitter')(RandomMatcher.prototype)

module.exports = RandomMatcher
