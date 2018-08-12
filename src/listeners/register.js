const io = require('../../bootstrap/socket')
const Player = require('../Game/Player')

module.exports = function (data, callback) {
    if (typeof this.client.username === 'string' && this.client.username.length) {
        return callback({
            message: 'You are already registered.',
            skipToLobby: true,
        })
    }

    if (!data.username || !~data.username.search(/^[a-z0-9\_]+$/gi)) {
        return callback({
            message: 'You did not provide a valid username.',
        })
    }

    const clients = io.of('/').adapter.nsp.connected
    const usernameIsOwned = Object.keys(clients)
        .includes(id => {
            return clients[id].username == data.username
        })

    if (usernameIsOwned) {
        return callback({
            message: 'Sorry, someone else is using this name right now.',
        })
    }

    this.broadcast.emit('online', { username: data.username })

    this.client.username = data.username
    this.client.player = new Player(this)

    callback(null)
}
