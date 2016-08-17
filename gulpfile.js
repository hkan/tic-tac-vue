var elixir = require('laravel-elixir')
require('laravel-elixir-vueify')

elixir.config.publicPath = '.'

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    /*
    |--------------------------------------------------------------------------
    | Application javascript
    |--------------------------------------------------------------------------
    */
    mix.browserify('app.js', elixir.config.publicPath + '/assets/js/app.js')

    /*
    |--------------------------------------------------------------------------
    | BrowserSync
    |--------------------------------------------------------------------------
    */
    mix.browserSync({
        files: [
            elixir.config.publicPath + '/assets/**/*',
            elixir.config.publicPath + '/*.html',
            elixir.config.publicPath + '/*.php',
        ],
        proxy: 'tic-tac-vue.dev',
        notify: false
    })
})
