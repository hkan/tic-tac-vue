// Database instance
var low = require('lowdb')
const db = low('db.json')

db.defaults({ messenger: [] }).value()

/*
|------------------------------------------------------------------------------
| Messenger object
|------------------------------------------------------------------------------
*/
var Messenger = {

    add: function (user, data) {
        // basic validation
        if (data.message.trim() == '') {
            return
        }

        // if the user hasn't chosen a username then specify a guest
        var usr = (user == undefined) ? 'Guest' : user

        // prepare the data for the database
        var data = { username: usr, message: data.message, timestamp: Date.now() }

        // add the data to the database
        db.get('messenger').push(data).value()

        // send an updated list of messages to the clients
        Messenger.emit('update', Messenger.latest())
    },

    /*
    |------------------------------------------------------------------------------
    | Getters
    |------------------------------------------------------------------------------
    */

    /**
     * Returns latest messenger data.
     */
    latest: function () {
        return db.get('messenger').sortBy('timestamp').reverse().take(20).reverse().value()
    },

    /*
    |------------------------------------------------------------------------------
    | Events
    |------------------------------------------------------------------------------
    */

    emit: function () {
        eventBus.emit.apply(eventBus, arguments)
    },

    on: function () {
        eventBus.on.apply(eventBus, arguments)
    },
}

require('event-emitter')(Messenger)
module.exports = Messenger
