import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import auth from './authStore'
import operators from './operatorStore'
import students from './studentStore'
import majors from './majorStore'
import classes from './classesStore'
import years from './schoolYearsStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    operators,
    students,
    majors,
    classes,
    years,
  },
})
