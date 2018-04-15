import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import Welcome from './pages/Welcome/Welcome.vue'
import Lobby from './pages/Lobby/Lobby.vue'
import Game from './pages/Game/Game.vue'

// Use vue-router.
Vue.use(VueRouter)

let router

// Create router instance.
export default router = new VueRouter({
    mode: 'history',

    routes: [
        {
            path: '/',
            exact: true,
            component: Welcome,
        },
        {
            path: '/lobby',
            component: Lobby,
        },
        {
            path: '/game',
            component: Game,
        },
    ],
})

router.beforeEach((to, from, next) => {
    if (to.path != '/' && !store.state.user.username) {
        return next('/')
    }

    next()
})
