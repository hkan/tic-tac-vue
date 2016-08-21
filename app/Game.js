var Game = function (home, away) {
    this.data = {}
    this.data.home = home
    this.data.away = away
    this.data.turn = 'away'
}

/*
|------------------------------------------------------------------------------
| Game
|------------------------------------------------------------------------------
*/

Game.prototype.init = function () {
    this.setRoom()
    this.initTable()

    this.home().game = game
    this.away().game = game

    this.home().opponent = this.away()
    this.away().opponent = this.home()

    this.emit('ready')
}

Game.prototype.initTable = function () {
    this.data.table = [
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty']
    ]
}

Game.prototype.setRoom = function () {
    // Create a new room
    this.room = 'game-' + Date.now()

    // Join both parties into the room
    this.home().join(this.room)
    this.away().join(this.room)

    this.emit('room-created', this.room)
}

Game.prototype.destroy = function () {
    // Clean up both player's game info
    this.home().opponent = null
    this.away().opponent = null

    this.home().started = false
    this.away().started = false

    this.emit('before-destroy')

    this.home().game = null
    this.away().game = null

    this.emit('destroy')
}

/*
 * Checks the cell at given row and column value
 */
Game.prototype.check = function (row, column) {
    if (this.stateFor(row, column) != 'empty') {
        throw new Error('Cell is already checked.')
    }

    this.data.table[row][column] = this.turn()

    this.switchTurn()

    this.emit('cell-checked', row, column, this[this.turn()]())
}

Game.prototype.switchTurn = function () {
    this.data.turn = this.turn() == 'home' ? 'away' : 'home'
}

/*
|------------------------------------------------------------------------------
| Getters
|------------------------------------------------------------------------------
*/

Game.prototype.home = function () {
    return this.data.home
}

Game.prototype.away = function () {
    return this.data.away
}

Game.prototype.turn = function () {
    return this.data.turn
}

Game.prototype.table = function () {
    return this.data.table
}

Game.prototype.stateFor = function (row, column) {
    return this.data.table[row][column]
}

// Make it 'eventable'
require('event-emitter')(Game.prototype)

module.exports = Game
