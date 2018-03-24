import Socket from 'socket.io-client'
import store from '../store'

const socket = new Socket({
    transports: ['websocket'],
})

export default socket

socket.on('connect', () => {
    store.dispatch('app/updateConnectionState', true)
})

socket.on('disconnect', () => {
    store.dispatch('app/updateConnectionState', false)
})
