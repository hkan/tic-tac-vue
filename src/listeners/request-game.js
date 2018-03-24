const io = require('../../bootstrap/socket')

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

    const sockets = io.of('/').adapter.nsp.connected
    const socketID = Object.keys(sockets)
        .find(id => {
            return sockets[id].client.username == data.username
        })

    if (!socketID) {
        return callback({
            message: 'Sorry, this user is not online right now.',
        })
    }

    sockets[socketID].emit('game-requested', { by: this.client.username })

    callback(null)
}