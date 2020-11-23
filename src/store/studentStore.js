export default {
  namespaced: true,
  state: {
    AllStudents: null,
  },
  mutations: {
    SET_ALL_STUDENTS(state, data) {
      state.AllStudents = data
    },
  },
  getters: {
    getAllStudents: (state) => state.AllStudents,
  },
}
