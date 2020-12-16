import { Parse } from './parseConfig'

class Majors {
  static async getAllMajors() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Majors')
      let q = new Parse.Query(Tb)

      q.equalTo('status', 1)
      q.doesNotExist('deletedAt')
      q.ascending('name')

      q.find().then((res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async getMajorById(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Majors')
      let q = new Parse.Query(Tb)

      q.equalTo('status', 1)
      q.doesNotExist('deletedAt')

      q.get(id).then((res) => {
          console.log(JSON.parse(JSON.stringify(res)))
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async addMajor(data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Majors')
      let q = new Tb()

      q.set('name', data.name)
      q.set('code', data.code)
      q.set('status', 1)

      q.save().then((res) => {
          console.log('new majors', res)
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async updateMajor(data) {
    return new Promise((resolve, reject) => {
      const User = new Parse.Object.extend('Majors')
      let q = new Parse.Query(User)

      q.get(data.id).then((res) => {
          res.set('name', data.name)
          res.set('code', data.code)

          console.log('updated majors', res)

          res.save().then((r) => {
              resolve(JSON.parse(JSON.stringify(r)))
            }, (err) => reject(err)
          )
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async deleteMajor(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Majors')
      let q = new Parse.Query(Tb)

      q.get(id).then((res) => {
          res.set('status', 500)
          res.set('deletedAt', new Date())
          res.save().then((r) => {
              resolve(JSON.parse(JSON.stringify(r)))
            }, (err) => reject(err)
          )
        }, (err) => {
          reject(err)
        }
      )
    })
  }
}

export default Majors
