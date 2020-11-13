export default ({
    namespaced: true,
    state: {
        sessionToken: null,
        currentUser: null, 
        userId: null,
        level: null,
    },
    mutations: {
        SET_SESSION_TOKEN(state, data){
            state.sessionToken = data
        },
        SET_CURRENT_USER(state, data){
            state.currentUser = data
        },
        SET_USER_ID(state, data){
            state.userId = data
        },
        SET_LEVEL(state, data){
            state.level = data
        }
    },
    getters: {
        getSessionToken: (state) => state.sessionToken,
        getUserId: (state) => state.userId,
        getLevel: (state) => state.level
    }
})