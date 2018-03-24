// HTTP Server
const app = require('express')()
const http = require('http').Server(app)

// Serve static assets.
app.use(require('express').static(
    require('path').resolve(
        __dirname,
        '../public'
    )
))

app.get('*', function (req, res, next) {
    res.sendFile(
        require('path').resolve(
            __dirname,
            '../public/index.html'
        )
    )
})

// Start HTTP Server
http.listen(process.env.APP_PORT, '0.0.0.0', err => {
    if (err) {
        return console.error('HTTP server cannot start.')
    }

    console.log('HTTP server started listening on ' + process.env.APP_PORT)
})

module.exports = {
    app,
    http,
}
