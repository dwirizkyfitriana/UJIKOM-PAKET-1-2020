import { Parse } from './parseConfig'

class Years {
  static async getAllSchoolYears() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('SchoolYears')
      let q = new Parse.Query(Tb)

      q.ascending('year')

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
      const Tb = Parse.Object.extend('SchoolYears')
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

  static async addSchoolYears(data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('SchoolYears')
      let q = new Parse.Query(Tb)

      q.set('year', data.year)
      q.set('amountPaid', data.amountPaid)

      q.save.then((res) => {
          console.log('new School Years', res)
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        }
      )
    })
  }

  static async updateSchoolYears(data) {
    return new Promise((resolve, reject) => {
      const Tb = new Parse.Object.extend('SchoolYears')
      let q = new Parse.Query(Tb)

      q.get(data.id).then((res) => {
          res.set('year', data.year)
          res.set('amountpaid', data.amountPaid)

          console.log('updated School Years', res)

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

  static async deleteSchoolYears(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('SchoolYears')
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

export default Years
