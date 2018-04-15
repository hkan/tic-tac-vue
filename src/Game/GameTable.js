const Cell = require('./GameTableCell')

module.exports = class Table {

    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game

        /**
         * @type {object}
         */
        this.state = [
            [new Cell(), new Cell(), new Cell()],
            [new Cell(), new Cell(), new Cell()],
            [new Cell(), new Cell(), new Cell()]
        ]
    }

    /**
     * @param {number} row
     * @param {number} col
     * @returns {Cell}
     */
    cell(row, col) {
        return this.state[row][col]
    }
}