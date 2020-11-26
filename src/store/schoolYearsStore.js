export default {
    namespaced: true,
    state: {
      AllYears: null,
    },
    mutations: {
      SET_ALL_YEARS(state, data) {
        state.AllYears = data
      },
    },
    getters: {
      getAllYears: (state) => state.AllYears,
    },
  }
  