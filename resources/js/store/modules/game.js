import socket from '../../socket'
import timeout from 'timeout-callback'

export default {
    namespaced: true,

    state: {
        cells: [
            ['empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty'],
        ],

        turn: false,
    },

    actions: {
        markCell(context, { row, column, value }) {
            return new Promise((resolve, reject) => {
                socket.emit('game:mark', { row, column }, timeout(30 * 1000, err => {
                    if (err) {
                        return reject(err)
                    }

                    context.commit('mark', { row, column, value })
                    resolve()
                }))
            })
        },

        markCellDirect(context, { row, column, value }) {
            context.commit('mark', { row, column, value })
        },
    },

    mutations: {
        mark(state, { row, column, value }) {

            // Cell cannot be set anything else than `home` or `away`.
            if (!~['home', 'away'].indexOf(value)) {
                return
            }

            // This is the actual update.
            state.cells[row][column] = value

            // This is here because Vue cannot pick up array modifications.
            state.cells.splice(0, 3, ...state.cells)
        },
    },
}