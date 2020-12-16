export default {
    namespaced: true,
    state: {
      AllTransactions: null,
    },
    mutations: {
      SET_ALL_TRANSACTIONS(state, data) {
        state.AllTransactions = data
      },
    },
    getters: {
      getAllTransactions: (state) => state.AllTransactions,
    },
  }