export default {
    namespaced: true,
    state: {
        text: '',
        color: '',
        timeout: '',
    },
    mutations: {
        SNACKBAR: function(state, value) {
            state.text = value.text
            state.color = value.color
            state.timeout = value.timeout
        },
    },
    actions: {
        snackbar: function({ commit }, payload) {
            commit('SNACKBAR', payload)
        },
    },
}
