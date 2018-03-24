import Vue from 'vue'
import Vuex from 'vuex'

import structure from './structure'

// Use vuex.
Vue.use(Vuex)

// Create and export store instance.
export default new Vuex.Store(structure)
