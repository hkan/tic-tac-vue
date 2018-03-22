const ioredis = require('ioredis')

module.exports = new ioredis(process.env.REDIS_URL)
