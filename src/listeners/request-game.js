const io = require('../../bootstrap/socket')
const { Request } = require('../Request')

module.exports = function (data, callback) {
    if (!typeof this.client.username === 'string' || !this.client.username.length) {
        return callback({
            message: 'You are not registered.',
            skipToLobby: true,
        })
    }

    if (!data.username || !~data.username.search(/^[a-z0-9\_]+$/gi)) {
        return callback({
            message: 'You did not provide a valid username.',
        })
    }

    const allSockets = io.of('/').adapter.nsp.connected
    const opponentSocketID = Object.keys(allSockets)
        .find(id => {
            return allSockets[id].client.username == data.username
        })

    if (!opponentSocketID) {
        return callback({
            message: 'Sorry, this user is not online right now.',
        })
    }

    Request.make(this, allSockets[opponentSocketID])

    callback(null)
}