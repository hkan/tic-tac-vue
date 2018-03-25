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

app.set('views', require('path').resolve(__dirname, '../public'))
app.set('view engine', 'hbs')

app.get('*', function (req, res, next) {
    res.render('index.hbs', {
        style: process.env.NODE_ENV === 'production',
    })
})

// Start HTTP Server
http.listen(process.env.PORT, '0.0.0.0', err => {
    if (err) {
        return console.error('HTTP server cannot start.')
    }

    console.log('HTTP server started listening on ' + process.env.PORT)
})

module.exports = {
    app,
    http,
}
