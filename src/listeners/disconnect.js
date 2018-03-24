module.exports = function () {
    if (typeof this.client.username !== 'string' || !this.client.username.length) {
        return
    }

    this.broadcast.emit('offline', { username: this.client.username })
}