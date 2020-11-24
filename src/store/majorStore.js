export default {
  namespaced: true,
  state: {
    AllMajors: null,
  },
  mutations: {
    SET_ALL_MAJORS(state, data) {
      state.AllMajors = data
    },
  },
  getters: {
    getAllMajors: (state) => state.AllMajors,
  },
}
