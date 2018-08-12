const ioredis = require('ioredis')

const redis = new ioredis(process.env.REDIS_URL)
    .on('error', err => {})

module.exports = redis;
