import { Parse } from './parseConfig'

class Students {
  static async getAllStudents() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Student')
      let q = new Parse.Query(Tb)

      q.include('major')
      q.include('class')
      q.ascending('nis')

      q.find().then((res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => reject(err))
    })
  }

  static async getStudentById(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Student')
      let q = new Parse.Query(Tb)

      q.include('major')
      q.include('class')

      q.get(id).then((res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => reject(err))
    })
  }

  static async addStudent(data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Student')
      let q = new Parse.Query(Tb)

      q.set('nis', data.nis)
      q.set('name', data.name)
      q.set('major', data.major)
      q.set('class', data.class)
      q.set('schoolYears', data.schoolYears)
      q.set('spp')

      q.save().then((res) => {
          console.log('new student', res)
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => {
          reject(err)
        })
    })
  }

  static async updateStudent(data) {
    return new Promise((resolve, reject) => {
      const User = new Parse.Object.extend('User')
      let q = new Parse.Query(User)

      q.get(data.id).then((res) => {
          res.set('nis', data.nis)
          res.set('name', data.name)
          res.set('major', data.major)
          res.set('class', data.class)
          res.set('schoolYears', data.schoolYears)
          res.set('spp')

          console.log('new operator', res)

          res.save().then(
            (r) => {
              resolve(JSON.parse(JSON.stringify(r)))
            }, (err) => reject(err))
      }, (err) => reject(err))
    })
  }

  static async deleteStudent(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('User')
      let q = new Parse.Query(Tb)

      q.get(id).then((res) => {
          res.set('status', 500)
          res.set('deletedAt', new Date())
          res.save().then(
            (r) => {
              resolve(JSON.parse(JSON.stringify(r)))
            }, (err) => reject(err))
      }, (err) => reject(err))
    })
  }
}

export default Students
