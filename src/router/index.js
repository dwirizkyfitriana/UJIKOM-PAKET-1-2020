import Vue from 'vue'
import VueRouter from 'vue-router'

// import components
import Dashboard from '../views/dashboard'
import Operator from '../views/operator'
import Student from '../views/student'
import Transaction from '../views/transaction'
import Report from '../views/report'

Vue.use(VueRouter)

export default new VueRouter({
  history: true,
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/operator',
        name: 'Operator',
        component: Operator,
    },
    {
        path: '/student',
        name: 'Student',
        component: Student,
    },
    {
        path: '/transaction',
        name: 'Transaction',
        component: Transaction,
    },
    {
        path: '/report',
        name: 'Report',
        component: Report,
    },
  ],
})
