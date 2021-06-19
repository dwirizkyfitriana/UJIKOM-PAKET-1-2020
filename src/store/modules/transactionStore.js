import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        transactions: [],
        studentTransactions: [],
    }
}

const Tb = Parse.Object.extend('Transaction')

export default {
    namespaced: true,
    state: getInitialState(),
    mutations: {
        SET(state, [key, value]) {
            state[key] = value
        },
        UNSHIFT(state, [key, value]) {
            state[key].unshift(value)
        },
    },
    getters: {
        getTransactions: (state) => state.transactions,
        getStudentTransactions: (state) => state.studentTransactions,
    },
    actions: {
        fetchTransactions: async function(context, payload) {
            return new Promise(async (resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.descending('createdAt')
                query.include('student.major')
                query.include('student.class')
                query.include('student.schoolYears')

                query.find().then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log(res)
                        context.commit('SET', ['transactions', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        fetchTransactionById: async function(context, payload) {
            return new Promise(async (resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.include('student.major')
                query.include('student.class')
                query.include('student.schoolYears')

                query.get(payload).then(
                    (res) => {
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        fetchStudentTransactions: async function(context, payload) {
            return new Promise(async (resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.equalTo('student', {
                    __type: 'Pointer',
                    className: 'Student',
                    objectId: payload,
                })
                query.include('student.major')
                query.include('student.class')
                query.include('student.schoolYears')

                query.find().then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log(res)
                        context.commit('SET', ['studentTransactions', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        addTransaction: async function(context, payload) {
            return new Promise(async (resolve, reject) => {
                const query = new Tb()

                let today = new Date()
                let day = String(today.getDate()).padStart(2, '0')
                let month = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
                let year = today.getFullYear()

                today = day + month + year
                let serial =
                    'TRX-' + today + Math.floor(100 + Math.random() * 900)
                console.log(serial)

                query
                    .save({
                        ...payload,
                        statusid: 1,
                        serialCode: serial,
                        student: {
                            __type: 'Pointer',
                            className: 'Student',
                            objectId: payload.student,
                        },
                    })
                    .then(
                        (res) => {
                            res = JSON.parse(JSON.stringify(res))

                            // fetch student
                            let student =
                                context.rootGetters['students/getStudents']
                            student = student.filter(
                                (item) => item.objectId == res.student.objectId
                            )
                            student = student.reduce((acc) => acc)
                            res = { ...res, student: student }

                            console.log(res)

                            context.commit('UNSHIFT', [
                                'studentTransactions',
                                res,
                            ])
                            context.commit('UNSHIFT', ['transactions', res])
                            resolve(res)
                        },
                        (err) => reject(err)
                    )
            })
        },
    },
}
