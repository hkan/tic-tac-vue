import socket from '../../socket'
import timeout from 'timeout-callback'

export default {
    namespaced: true,

    state: {
        requestInProgress: false,
        username: null,
    },

    actions: {
        sendRequestToUser(context, data) {
            if (context.state.requestInProgress) {
                return Promise.reject(new Error('Another request is in progress.'))
            }

            context.commit('requestInProgress')

            return new Promise((resolve, reject) => {
                socket.emit('request-game', data, timeout(30 * 1000, err => {
                    context.commit('requestInProgress', false)

                    if (err) {
                        return reject(err.message)
                    }

                    resolve()
                }, { isolateFirstArgForTimeoutError: false }))
            })
        },

        acceptRequest(context, data) {
            return new Promise((resolve, reject) => {
                socket.emit('request:accept', data, timeout(30 * 1000, err => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve()
                }))
            })
        },

        refuseRequest(context, data) {
            return new Promise((resolve, reject) => {
                socket.emit('request:refuse', data, timeout(30 * 1000, err => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve()
                }))
            })
        },
    },

    mutations: {
        username(state, username) {
            state.username = username
        },

        requestInProgress(state, status = true) {
            state.requestInProgress = status
        },
    },
}