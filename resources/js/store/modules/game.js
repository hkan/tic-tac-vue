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