import Vue from 'vue'
import VueRouter from 'vue-router'

// import components
import Login from '../views/login'
import Dashboard from '../views/dashboard'
import Operator from '../views/operator'
import SchoolYears from '../views/schoolyear'
import Student from '../views/student'
import StudentInfo from '../views/student/student'
import Majors from '../views/majors'
import Classes from '../views/classes'
import Transaction from '../views/transaction'
import Report from '../views/report'
import NotFoundPage from '../views/404Page'

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
                requiresAuth: true,
            },
        },
        {
            path: '/operator',
            name: 'Data Petugas',
            component: Operator,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/school-years',
            name: 'Tahun Ajaran',
            component: SchoolYears,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/student',
            name: 'Data Siswa',
            component: Student,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/student-info',
            name: 'Info Siswa',
            component: StudentInfo,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/majors',
            name: 'Kompetensi Keahlian',
            component: Majors,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/classes',
            name: 'Data Kelas',
            component: Classes,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/transaction',
            name: 'Transaksi',
            component: Transaction,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/report',
            name: 'Laporan',
            component: Report,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '*',
            name: 'Not Found',
            component: NotFoundPage,
        },
    ],
})

export default router

router.beforeEach((to, from, next) => {
    const sessionToken = localStorage.getItem('sessionToken')
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!sessionToken) {
            next({
                path: '/login',
                query: { redirect: to.fullPath },
            })
        } else {
            next()
        }
    } else {
        next()
    }
})
