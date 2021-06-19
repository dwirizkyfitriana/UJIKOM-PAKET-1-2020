/*eslint-disable*/
import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        classes: [],
    }
}

const Tb = Parse.Object.extend('Classes')

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
        getClasses: (state) => state.classes,
    },
    actions: {
        fetchClasses: async function(context) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.include('major')
                query.descending('createdAt')
                query.doesNotExist('deletedAt')

                query.find().then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log('res', res)
                        context.commit('SET', ['classes', res])
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        fetchClassById: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.get(payload).then(
                    (res) => {
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },

        addClass: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Tb()

                delete payload.objectId

                query
                    .save({
                        ...payload,
                        major: {
                            __type: 'Pointer',
                            className: 'Majors',
                            objectId: payload.major,
                        },
                    })
                    .then(
                        (res) => {
                            res = JSON.parse(JSON.stringify(res))

                            // fetch (include) major
                            let major = context.rootGetters['majors/getMajors']
                            major = major.filter(
                                (item) => item.objectId == res.major.objectId
                            )
                            major = major.reduce((acc) => acc)
                            res = { ...res, major: major }

                            console.log('new', res)
                            context.commit('UNSHIFT', ['classes', res])
                            resolve(res)
                        },
                        (err) => reject(err)
                    )
            })
        },

        updateClass: async function(context, payload) {
            return new Promise((resolve, reject) => {
                console.log('payload', payload)
                context.dispatch('fetchClassById', payload.objectId).then(
                    (res) => {
                        res.save({
                            ...payload,
                            major: {
                                __type: 'Pointer',
                                className: 'Majors',
                                objectId: payload.major.objectId,
                            },
                        }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))

                                // fetch (include) Major
                                let major =
                                    context.rootGetters['majors/getMajors']
                                major = major.filter(
                                    (item) =>
                                        item.objectId == response.major.objectId
                                )
                                major = major.reduce((acc) => acc)
                                response = { ...response, major: major }

                                console.log('new', response)
                                context.commit('UPDATE', ['classes', response])
                                resolve(response)
                            },
                            (err) => reject(err)
                        )
                    },
                    (err) => reject(err)
                )
            })
        },

        deleteClass: async function(context, payload) {
            return new Promise((resolve, reject) => {
                context.dispatch('fetchClassById', payload).then(
                    (res) => {
                        res.save({ deletedAt: new Date() }).then(
                            (response) => {
                                response = JSON.parse(JSON.stringify(response))
                                console.log('new', response)
                                context.commit('DELETE', ['classes', response])
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
