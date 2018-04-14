const Socket = require('socket.io/lib/socket')
const Game = require('../Game')

module.exports = class Request {

    /**
     * @param {Socket} requester
     * @param {Socket} requestee
     */
    static make(requester, requestee) {
        const request = new Request(requester, requestee)

        request.notifyRequestee()

        return request
    }

    /**
     * @param {Socket} requester
     * @param {Socket} requestee
     */
    constructor(requester, requestee) {

        // Parameter validation
        if (requester.constructor !== Socket || requestee.constructor !== Socket) {
            throw new Error(`Unexpected parameter type. Expected {SocketIO.Socket} for both, got {${requester.constructor}} and {${requestee.constructor}}.`)
        }

        this.requester = requester
        this.requestee = requestee

        this.handleAcceptEvent = this.handleAcceptEvent.bind(this)
        this.handleRefuseEvent = this.handleRefuseEvent.bind(this)

        this.bindListeners()
    }

    notifyRequestee() {
        this.requestee.emit('request', {
            by: this.requester.client.username,
        })
    }

    bindListeners() {
        this.requestee.on('request:accept', this.handleAcceptEvent)
        this.requestee.on('request:refuse', this.handleRefuseEvent)
    }

    unbindListeners() {
        this.requestee.removeListener('request:accept', this.handleAcceptEvent)
        this.requestee.removeListener('request:refuse', this.handleRefuseEvent)
    }

    /**
     * @param {Object} data
     * @param {Function?} callback
     */
    handleAcceptEvent(data, callback) {

        // Not this request that is being accepted.
        if (data.username != this.requester.client.username) {
            return
        }

        callback(null)

        this.accept()
        this.destruct()
    }

    /**
     * @param {Object} data
     * @param {Function?} callback
     */
    handleRefuseEvent(data, callback) {

        // Not this request that is being refused.
        if (data.username != this.requester.client.username) {
            return
        }

        callback(null)

        this.refuse()
        this.destruct()
    }

    accept() {
        this.requester.emit('request:accepted', {
            username: this.requestee.client.username,
        })

        Game.make(this.requester.player, this.requestee.player)
    }

    refuse() {
        this.requester.emit('request:refused', {
            username: this.requestee.client.username,
        })
    }

    destruct() {
        this.unbindListeners()
    }

}