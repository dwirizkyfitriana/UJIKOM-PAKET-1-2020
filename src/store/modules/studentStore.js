/* eslint-disable */
import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        students: [],
        student: {},
    }
}

const Tb = new Parse.Object.extend('Student')

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
        UPDATE: function(state, [key, value]) {
            state[key] = state[key].map((item) => {
                if (item.objectId == value.objectId)
                    return { ...item, ...value }
                else return item
            })
        },
        DELETE: function(state, [key, value]) {
            state[key] = state[key].filter(
                (item) => item.objectId != value.objectId
            )
        },
        RESET: function(state) {
            Object.assign(state, getInitialState())
        },
    },
    getters: {
        getStudents: (state) => state.students,
        getStudent: (state) => state.student,
    },
    actions: {
        fetchStudents: async function(context) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.include('major')
                query.include('class')
                query.include('schoolYears.year')
                query.ascending('nis')
                query.doesNotExist('deletedAt')

                query.find().then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log('students', res)
                        context.commit('SET', ['students', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        fetchStudentById: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.include('major')
                query.include('class')
                query.include('schoolYears.year')

                query.get(payload).then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        context.commit('SET', ['student', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        addStudent: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Tb()

                console.log(payload)

                delete payload.objectId

                query
                    .save({
                        ...payload,
                        major: {
                            __type: 'Pointer',
                            className: 'Majors',
                            objectId: payload.major,
                        },
                        class: {
                            __type: 'Pointer',
                            className: 'Classes',
                            objectId: payload.class,
                        },
                        schoolYears: {
                            __type: 'Pointer',
                            className: 'schoolYears',
                            objectId: payload.schoolYears,
                        },
                    })
                    .then((res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log('new', res)
                        context.commit('UNSHIFT', ['students', res])
                        resolve(res)
                    })
            })
        },

        updateStudent: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                context.dispatch('fetchStudentById', payload.objectId).then(
                    (res) => {
                        res.save({
                            ...payload,
                            major: {
                                __type: 'Pointer',
                                className: 'Majors',
                                objectId: payload.major,
                            },
                            class: {
                                __type: 'Pointer',
                                className: 'Classes',
                                objectId: payload.class,
                            },
                            schoolYears: {
                                __type: 'Pointer',
                                className: 'schoolYears',
                                objectId: payload.schoolYears,
                            },
                        }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))
                                console.log('updated', response)
                                context.commit('UPDATE', ['students', response])
                                resolve(response)
                            },
                            (err) => reject(err)
                        )
                    },
                    (err) => reject(err)
                )
            })
        },

        deleteStudent: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                context.dispatch('fetchStudentById', payload).then(
                    (res) => {
                        res.save({ deletedAt: new Date() }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))
                                console.log('deleted', response)
                                context.commit('DELETE', ['students', response])
                                resolve(response)
                            },
                            (err) => reject(err)
                        )
                    },
                    (err) => reject(err)
                )
            })
        },
    },
}
