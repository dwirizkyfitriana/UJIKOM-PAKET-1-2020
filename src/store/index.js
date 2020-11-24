import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import auth from './authStore'
import operators from './operatorStore'
import students from './studentStore'
import majors from './majorStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    operators,
    students,
    majors,
  },
})
