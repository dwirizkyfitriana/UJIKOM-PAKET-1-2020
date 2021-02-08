import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import auth from './modules/authStore'
import operators from './modules/operatorStore'
import students from './modules/studentStore'
import majors from './modules/majorStore'
import classes from './modules/classesStore'
import years from './modules/schoolYearsStore'
import transaction from './modules/transactionStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: auth,
    operators: operators,
    students: students,
    majors: majors,
    classes: classes,
    years: years,
    transaction: transaction,
  },
})
