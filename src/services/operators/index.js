import { Parse } from '../parseConfig'

class Operators {
  static async getAllOperators() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('User')
      let q = new Parse.Query(Tb)

      q.equalTo('type', 'operator')
      q.find().then(
        (res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  static async addOperator(data) {
    return new Promise((resolve, reject) => {
      let user = new Parse.User()

      user.set('name', data.name)
      user.set('username', data.username)
      user.set('password', data.password)
      user.set('email', data.email)
      user.set('type', 'operator')

      user.signUp().then((res) => {
          console.log('new operator', res)
          resolve(res)
      }, (err) => {
          reject(err)
      })

    })
  }
}

export default Operators
