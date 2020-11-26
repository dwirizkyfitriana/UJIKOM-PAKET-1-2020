export default {
    namespaced: true,
    state: {
      AllClasses: null,
    },
    mutations: {
      SET_ALL_CLASSES(state, data) {
        state.AllClasses = data
      },
    },
    getters: {
      getAllClasses: (state) => state.AllClasses,
    },
  }
  