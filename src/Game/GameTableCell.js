module.exports = class Cell {
    constructor() {
        this.state = 0
    }

    async set(newState) {
        if (this.state !== 0) {
            throw new Error('The cell is not empty.')
        }

        this.state = newState
    }
}