/**
 * @param {Object} client The client who sends the match request.
 * @param {Object} opponent The client to send request to.
 */
var UsernameMatcher = function (client, opponent) {
    this.client = client
    this.opponent = opponent
    this.confirmed = false

    this.client.Matcher = this
    this.opponent.Matcher = this
}

/**
 * Sends the request
 */
UsernameMatcher.prototype.sendRequest = function () {
    this.emit('request')
}

/**
 * Request denial
 */
UsernameMatcher.prototype.deny = function () {
    delete this.client.Matcher
    delete this.opponent.Matcher

    this.emit('denied')
}

/**
 * Request confirmal
 */
UsernameMatcher.prototype.confirm = function () {
    this.confirmed = true

    this.emit('confirmed')
}

/**
 * Ready to start
 */
UsernameMatcher.prototype.ready = function (socket) {
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
require('event-emitter')(UsernameMatcher.prototype)

module.exports = UsernameMatcher
