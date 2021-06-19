import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
    return {
        sessionToken: null,
        currentUser: null,
        userId: null,
        level: null,
    }
}

export default {
    namespaced: true,
    state: getInitialState(),
    mutations: {
        SET: function(state, [key, value]) {
            state[key] = value
        },
        RESET: function(state) {
            Object.assign(state, getInitialState())
        },
    },
    getters: {
        getSessionToken: (state) => state.sessionToken,
        getCurrentUser: (state) => state.currentUser,
        getUserId: (state) => state.userId,
        getLevel: (state) => state.level,
    },
    actions: {
        login: async function(context, payload) {
            return new Promise((resolve, reject) => {
                Parse.User.logIn(
                    payload.username.toLowerCase(),
                    payload.password
                ).then(
                    (res) => {
                        let temp = JSON.parse(JSON.stringify(res))
                        let currentUser = Parse.User.current()

                        if (!temp) reject('User Not Found')
                        if (temp.status !== 1) reject('User Not Found')

                        localStorage.setItem('sessionToken', temp.sessionToken)
                        localStorage.setItem('userId', temp.objectId)
                        localStorage.setItem('level', temp.level)

                        context.commit('SET', [
                            'SET_SESSION_TOKEN',
                            temp.sessionToken,
                        ])
                        context.commit('SET', ['SET_CURRENT_USER', currentUser])
                        context.commit('SET', ['SET_USER_ID', temp.objectId])
                        context.commit('SET', ['SET_LEVEL', temp.level])
                        resolve(temp)
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        },

        logout: async function(context) {
            return new Promise((resolve, reject) => {
                Parse.User.logOut().then(
                    (res) => {
                        let temp = JSON.parse(JSON.stringify(res))
                        localStorage.clear()
                        context.commit('RESET')
                        resolve(temp)
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        },

        resetPassword: async function(payload) {
            return new Promise((resolve, reject) => {
                Parse.User.requestPasswordReset(payload.email).then(
                    (res) => {
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            })
        },
    },
}
