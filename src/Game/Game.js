const Table = require('./GameTable')
const Player = require('./Player')

module.exports = class Game {

    /**
     * @param {Player} home
     * @param {Player} away
     */
    static make(home, away) {
        const game = new Game(home, away)

        game.init()

        return game
    }

    /**
     * @param {Player} home
     * @param {Player} away
     */
    constructor(home, away) {
        this.home = home
        this.away = away

        /**
         * @enum {GameStatus}
         */
        this.status = 0

        /**
         * @type {string}
         */
        this.roomName = null

        /**
         * @type {Player}
         */
        this.turn = away

        /**
         * @type {Table}
         */
        this.table = new Table(this)

        // Bindings
        this.homeMark = this.homeMark.bind(this)
        this.awayMark = this.awayMark.bind(this)
    }

    /**
     *
     */
    init() {
        this.home.setGame(this)
        this.away.setGame(this)

        this.home.setOpponent(this.away)
        this.away.setOpponent(this.home)

        this.startListeningSocketEvents()
    }

    /**
     * @param {string} roomName
     */
    setRoomName(roomName) {
        this.roomName = roomName
    }

    startListeningSocketEvents() {
        this.home.socket.on('game:mark', this.homeMark)
        this.away.socket.on('game:mark', this.awayMark)
    }

    stopListeningSocketEvents() {
        this.home.socket.off('game:mark', this.homeMark)
        this.away.socket.off('game:mark', this.awayMark)
    }

    async homeMark({ row, column }, callback) {
        if (this.turn !== this.home) {
            return callback({
                message: 'It\'s not your turn.',
            })
        }

        try {
            await this.table.cell(row, column).set(1)
        } catch (e) {
            return callback({
                message: e.message || e,
            })
        }

        this.away.socket.emit('game:marked', { row, column })
        this.turn = this.away

        callback()
    }

    async awayMark({ row, column }, callback) {
        if (this.turn !== this.away) {
            return callback({
                message: 'It\'s not your turn.',
            })
        }

        try {
            await this.table.cell(row, column).set(2)
        } catch (e) {
            return callback({
                message: e.message || e,
            })
        }

        this.home.socket.emit('game:marked', { row, column })
        this.turn = this.home

        callback()
    }

    /**
     *
     */
    destroy() {
        this.home.setGame(null)
        this.away.setGame(null)
    }
}
