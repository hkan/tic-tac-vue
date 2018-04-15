import socket from '../../socket'
import timeout from 'timeout-callback'

export default {
    namespaced: true,

    state: {
        registerInProgress: false,
        username: null,
    },

    actions: {
        register(context, data) {
            if (context.state.registerInProgress) {
                return Promise.reject(new Error('Another register is in progress.'))
            }

            context.commit('registerInProgress')

            return new Promise((resolve, reject) => {
                socket.emit('register', data, timeout(30 * 1000, err => {
                    context.commit('registerInProgress', false)

                    if (err) {
                        return reject(err.message)
                    }

                    context.commit('username', data.username)
                    resolve()
                }, { isolateFirstArgForTimeoutError: false }))
            })
        }
    },

    mutations: {
        username(state, username) {
            state.username = username
        },

        registerInProgress(state, status = true) {
            state.registerInProgress = status
        },
    },
}