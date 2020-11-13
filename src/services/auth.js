import { Parse } from './parseConfig'
import store from '../store'

class Auth {
  static async login(username, password) {
    return new Promise((resolve, reject) => {
      Parse.User.logIn(username.toLowerCase(), password).then(
        (res) => {

          let temp = JSON.parse(JSON.stringify(res))
          let currentUser = Parse.User.current()

          if (!temp) reject('User Not Found')
          if (temp.status !== 1) reject('User Not Found')

          localStorage.setItem('sessionToken', temp.sessionToken)
          localStorage.setItem('userId', temp.objectId)
          localStorage.setItem('level', temp.level)

          store.commit('auth/SET_SESSION_TOKEN', temp.sessionToken)
          store.commit('auth/SET_CURRENT_USER', currentUser)
          store.commit('auth/SET_USER_ID', temp.objectId)
          store.commit('auth/SET_LEVEL',  temp.level)
          resolve(temp)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  static async logout() {
    return new Promise((resolve, reject) => {
      Parse.User.logOut().then(
        (res) => {
          let temp = JSON.parse(JSON.stringify(res))
          localStorage.clear()
          resolve(temp)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  static async resetPassword(email) {
    return new Promise((resolve, reject) => {
      Parse.User.requestPasswordReset(email).then((res) => {
        resolve(res)
      }, (err) => reject(err))
    })
  }

}

export default Auth
