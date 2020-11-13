import Vue from 'vue'
import VueRouter from 'vue-router'

// import components
import Login from '../views/login'
import Dashboard from '../views/dashboard'
import Operator from '../views/operator'
import Student from '../views/student'
import Transaction from '../views/transaction'
import Report from '../views/report'

Vue.use(VueRouter)

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/operator',
      name: 'Operator',
      component: Operator,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/student',
      name: 'Student',
      component: Student,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: Transaction,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: {
        requiresAuth: true
      }
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const sessionToken = localStorage.getItem('sessionToken')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!sessionToken) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})