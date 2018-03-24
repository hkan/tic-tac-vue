export default {
    namespaced: true,

    state: {
        isConnected: false,
    },

    actions: {
        updateConnectionState(context, isConnected = true) {
            context.commit('isConnected', isConnected)
        }
    },

    mutations: {
        isConnected(state, isConnected = true) {
            state.isConnected = isConnected
        }
    },
}