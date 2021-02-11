/* eslint-disable */
import { Parse } from '../../services/parseConfig'

const getInitialState = () => {
  return {
    schoolYears: []
  }
}

const Tb = Parse.Object.extend('SchoolYears')

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
        state[key] = state[key].map(item => {
          if(item.objectId == value.objectId) return {...item, ...value}
          else return item
        })
      },
      DELETE: function(state, [key, value]) {
        state[key] = state[key].filter(item => item.objectId != value.objectId) 
      },
      RESET: function(state) {
        Object.assign(state, getInitialState())
      }
    },
    getters: {
      getSchoolYears: (state) => state.schoolYears,
    },
    actions: {
      fetchSchoolYears: async function(context) {
        return new Promise((resolve, reject) => {
          const query = new Parse.Query(Tb)

          query.descending('year')
          query.doesNotExist('deletedAt')

          query.find().then(res => {
            res = JSON.parse(JSON.stringify(res))
            console.log(res)
            context.commit('SET', ['schoolYears', res])
            resolve(res)
          }, err => reject(err))
        })
        
      },

      fetchSchoolyearById: async function(context, payload) {
        return new Promise((resolve, reject) => {
          const query = new Parse.Query(Tb)
  
          query.get(payload).then(res => {
            resolve(res)
          }, err => reject(err))
        })
      },

      addSchoolYear: async function(context, payload) {
        return new Promise((resolve, reject) => {
          const query = new Tb()

          delete payload.objectId
  
          query.save({...payload, year: parseInt(payload.year), amountPaid: parseInt(payload.amountPaid)}).then(res => {
            res = JSON.parse(JSON.stringify(res))
            console.log('new data', res)
            context.commit('UNSHIFT', ['schoolYears', res])
            resolve(res)
          }, err => reject(err))
        })
      },

      updateSchoolYear: async function(context, payload) {
        return new Promise((resolve, reject) => {
          const query = new Parse.Query(Tb)
  
          context.dispatch('fetchSchoolyearById', payload.objectId).then(res => {
            res.save({...payload, year: parseInt(payload.year), amountPaid: parseInt(payload.amountPaid)}).then(response => {
              response = JSON.parse(JSON.stringify(response))
              console.log('updated', response)
              context.commit('UPDATE', ['schoolYears', response])
              resolve(response)
            })
          }, err => reject(err))
        })
      },

      deleteSchoolYears: async function(context, payload) {
        return new Promise((resolve, reject) => {
          const query = new Parse.Query(Tb)
  
          context.dispatch('fetchSchoolyearById', payload).then(res => {
            res.save({deletedAt: new Date()}).then(response => {
              response = JSON.parse(JSON.stringify(response))
              console.log('deleted', response)
              context.commit('DELETE', ['schoolYears', response])
              resolve(response)
            })
          }, err => reject(err))
        })
      }
    }
  }
  