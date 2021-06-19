/* eslint-disable */
import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        majors: [],
    }
}

const Tb = new Parse.Object.extend('Majors')

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
        getMajors: (state) => state.majors,
    },
    actions: {
        fetchMajors: async function(context) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.equalTo('status', 1)
                query.doesNotExist('deletedAt')
                query.ascending('name')

                query.find().then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log(res)
                        context.commit('SET', ['majors', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        fetchMajorById: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.equalTo('status', 1)
                query.doesNotExist('deletedAt')

                query.get(payload).then(
                    (res) => {
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        addMajor: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Tb()

                delete payload.objectId

                query.save({ ...payload, status: 1 }).then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log(res)
                        context.commit('UNSHIFT', ['majors', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        updateMajor: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                context.dispatch('fetchMajorById', payload.objectId).then(
                    (res) => {
                        res.save({ ...payload }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))
                                console.log(response)
                                context.commit('UPDATE', ['majors', response])
                                resolve(response)
                            },
                            (err) => reject(err)
                        )
                    },
                    (err) => reject(err)
                )
            })
        },

        deleteMajor: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                context.dispatch('fetchMajorById', payload).then(
                    (res) => {
                        res.save({ status: 500, deletedAt: new Date() }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))
                                console.log(response)
                                context.commit('DELETE', ['majors', response])
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
