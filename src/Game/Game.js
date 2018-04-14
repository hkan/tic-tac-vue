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
         * @enum {[1, 2]}
         */
        this.turn = 1

        /**
         * @type {Table}
         */
        this.table = new Table(this)
    }

    /**
     *
     */
    init() {
        this.home.setGame(this)
        this.away.setGame(this)

        this.home.setOpponent(this.away)
        this.away.setOpponent(this.home)
    }

    /**
     * @param {string} roomName
     */
    setRoomName(roomName) {
        this.roomName = roomName
    }

    /**
     *
     */
    destroy() {
        this.home.setGame(null)
        this.away.setGame(null)
    }
}
