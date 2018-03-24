import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import './socket'

Vue.options.debug = process.env.NODE_ENV !== 'production'

new App({
    el: '#app',

    store,
    router,
})
