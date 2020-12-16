import { Parse } from './parseConfig'

class Students {
  static async getAllStudents() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Student')
      let q = new Parse.Query(Tb)

      q.include('major')
      q.include('class')
      q.include('schoolYears.year')
      q.ascending('nis')
      q.doesNotExist('deletedAt')

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
      q.include('schoolYears.year')

      q.get(id).then((res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        }, (err) => reject(err))
    })
  }

  static async addStudent(data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Student')
      let q = new Tb()

      q.set('nis', data.nis)
      q.set('name', data.name)
      q.set('gender', data.gender)
      q.set('major', { __type: 'Pointer', className: 'Majors', objectId: data.major })
      q.set('class', { __type: 'Pointer', className: 'Majors', objectId: data.class })
      q.set('schoolYears', { __type: 'Pointer', className: 'Majors', objectId: data.schoolYears })

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
          res.set('gender', data.gender)
          res.set('major', { __type: 'Pointer', className: 'Majors', objectId: data.major })
          res.set('class', { __type: 'Pointer', className: 'Majors', objectId: data.class })
          res.set('schoolYears', { __type: 'Pointer', className: 'Majors', objectId: data.schoolYears })

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
