import Vue from 'vue'
import TicTacToe from './components/TicTacToe.vue'

Vue.options.debug = true

new Vue({
    el: '#app',
    components: {
        TicTacToe
    }
})
