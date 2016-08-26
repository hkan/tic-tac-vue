module.exports = function (io, RandomMatcher) {
    RandomMatcher.on('pool-updated', function () {
        io.emit('pool-updated', { pool: RandomMatcher.poolCount() })
    })
}