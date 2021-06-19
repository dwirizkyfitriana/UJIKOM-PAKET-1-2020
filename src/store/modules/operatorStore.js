import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        operators: [],
    }
}

const Tb = Parse.Object.extend('User')

export default {
    namespaced: true,
    state: getInitialState(),
    mutations: {
        SET: function(state, [key, value]) {
            state[key] = value
        },
        UNSHIFT: function(state, [key, value]) {
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
        getOperators: (state) => state.operators,
    },
    actions: {
        fetchOperators: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.equalTo('type', 'operator')
                query.equalTo('status', 1)
                query.doesNotExist('deletedAt')
                query.descending('createdAt')

                query.find({ useMasterKey: true }).then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        context.commit('SET', ['operators', res])
                        resolve(res)
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        },

        fetchOperatorById: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                query.equalTo('type', 'operator')
                query.equalTo('status', 1)
                query.doesNotExist('deletedAt')

                query.get(payload, { useMasterKey: true }).then(
                    (res) => {
                        console.log(JSON.parse(JSON.stringify(res)))
                        resolve(res)
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        },

        addOperator: async function(context, payload) {
            return new Promise((resolve, reject) => {
                let user = new Parse.User()

                delete payload.objectId

                user.save(
                    { ...payload, type: 'operator', status: 1 },
                    { useMasterKey: true }
                ).then(
                    (res) => {
                        res = JSON.parse(JSON.stringify(res))
                        console.log('new operator', res)
                        context.commit('UNSHIFT', ['operators', res])
                        resolve(res)
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        },

        updateOperator: async function(context, payload) {
            return new Promise((resolve, reject) => {
                const query = new Parse.Query(Tb)

                context
                    .dispatch('fetchOperatorById', payload.objectId)
                    .then((res) => {
                        res.save(
                            { ...payload, type: 'operator' },
                            { useMasterKey: true }
                        ).then((response) => {
                            response = JSON.parse(JSON.stringify(response))
                            console.log(response)

                            context.commit('UPDATE', ['operators', response])
                            resolve(response)
                        })
                    })
            })
        },

        deleteOperator: async function(context, payload) {
            return new Promise((resolve, reject) => {
                let query = new Parse.Query(Tb)

                context.dispatch('fetchOperatorById', payload).then((res) => {
                    res.save(
                        { status: 500, deletedAt: new Date() },
                        { useMasterKey: true }
                    ).then((response) => {
                        response = JSON.parse(JSON.stringify(response))
                        console.log(response)
                        context.commit('DELETE', ['operators', response])
                        resolve(response)
                    })
                })
            })
        },
    },
}
