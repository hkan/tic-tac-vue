// Lodash
const _ = require('lodash')

// Player
const Player = require('../Game/Player')

// Game
const Game = require('../Game/Game')

module.exports = async function (username = null, callback) {

    // In the occasional case of client providing just a single parameter as the callback.
    if (_.isFunction(username)) {
        username = null
        callback = username
    }
    // In the rare case of client providing only a username and no callback.
    else if (!_.isFunction(callback)) {
        callback = function () { }
    }

    // Is this a proper way to check valid usernames?
    if (username !== null && typeof username !== 'string') {
        return callback({ error: 'Invalid username.' })
    }

    try {
        const match = await Player.randomOnline()
    } catch (err) {
        console.error(err)
        return callback({ error: 'Something went terribly wrong. I will look into it.' })
    }

    if (!match) {
        return callback({ error: 'Could not find anyone.' })
    }

    new Game(this.player, match.player)
}