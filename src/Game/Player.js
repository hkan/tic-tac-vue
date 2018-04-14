// Redis
const redis = require('../../bootstrap/redis')

// Socket.IO
const Server = require('../../bootstrap/socket')

// Socket class
const Socket = require('socket.io/lib/socket')

module.exports = class Player {

    /**
     *
     */
    static async randomOnline() {
        return redis.srandmember('online-list')
            .then(id => Server.sockets[id])
    }

    /**
     * @param {Socket} socket
     */
    constructor(socket) {

        /**
         * @type {Socket}
         */
        this.socket = socket

        /**
         * @type {Game?}
         */
        this.game = null

        /**
         * @type {PLayer?}
         */
        this.opponent = null

        this.setOnline()
        this.socket.on('disconnect', this.destruct.bind(this))

        /**
         * Socket event listeners
         */
        this.on = this.socket.on
        this.off = this.socket.off
        this.once = this.socket.once
    }

    /**
     * @param {Game|null} game
     */
    setGame(game) {
        this.game = game

        this[game !== null ? 'unsetOnline' : 'setOnline']()
    }

    /**
     * @param {Player?} opponent
     */
    setOpponent(opponent) {
        this.opponent = opponent
    }

    /**
     * @returns Promise
     */
    setOnline() {
        return redis.sadd('online-list', this.socket.id)
    }

    /**
     * @returns Promise
     */
    unsetOnline() {
        return redis.srem('online-list', this.socket.id)
    }

    /**
     *
     */
    destruct() {
        this.unsetOnline()
    }
}