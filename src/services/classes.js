import { Parse } from './parseConfig'

class Classes {
  static async getAllClasses() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Classes')
      let q = new Parse.Query(Tb)

      q.include('major')

      q.find().then((res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async getClassById(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Classes')
      let q = new Parse.Query(Tb)

      q.get(id).then((res) => {
          console.log(JSON.parse(JSON.stringify(res)))
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async addClass(data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Classes')
      let q = new Tb()

      q.set('name', data.name)

      q.save().then((res) => {
          console.log('new Class', res)
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async updateClass(data) {
    return new Promise((resolve, reject) => {
      const Tb = new Parse.Object.extend('Classes')
      let q = new Parse.Query(Tb)

      q.get(data.id).then((res) => {
          res.set('name', data.name)

          console.log('new Class', res)

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

  static async deleteClass(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Classes')
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

export default Classes
