export default {
  namespaced: true,
  state: {
    AllOperators: null,
  },
  mutations: {
    SET_ALL_OPERATORS(state, data) {
      state.AllOperators = data
    },
  },
  getters: {
    getAllOperators: (state) => state.AllOperators,
  },
}
