// Database instance
var low = require('lowdb')
const db = low('db.json')

db.defaults({ leaderboard: [] }).value()

/*
|------------------------------------------------------------------------------
| Leaderboard object
|------------------------------------------------------------------------------
*/
var Leaderboard = {

    won: function (username) {
        var user = Leaderboard.user({ username: username })

        Leaderboard.update(user, { won: user.won + 1 })

        // Trigger update event
        Leaderboard.emit('update', Leaderboard.current())
    },

    lost: function (username) {
        var user = Leaderboard.user({ username: username })

        Leaderboard.update(user, { lost: user.lost + 1 })

        // Trigger update event
        Leaderboard.emit('update', Leaderboard.current())
    },

    /**
     * Updates given user with given data.
     *
     * @param {object} user
     * @param {object} data
     */
    update: function (user, data) {
        return Leaderboard.query({ username: user.username }).assign(data).value()
    },

    /*
    |------------------------------------------------------------------------------
    | Getters
    |------------------------------------------------------------------------------
    */

    /**
     * Returns current leaderboard data.
     */
    current: function () {
        return db.get('leaderboard').orderBy([function (o) {
            return Math.floor(o.won - o.lost)
        }, 'username'], ['desc', 'asc']).take(20).value()
    },

    query: function (where) {
        return db.get('leaderboard').find(where)
    },

    /**
     * Returns the user with their win/lose counts.
     *
     * @return {object}
     */
    user: function (where) {
        var query = Leaderboard.query(where),
            user = query.value()

        // If user is not on leaderboard data yet, create it
        if (!user) {
            user = { username: where.username, won: 0, lost: 0 }

            db.get('leaderboard').push(user).value()
        }

        return user
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

require('event-emitter')(Leaderboard)
module.exports = Leaderboard
