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
        }, (err) => reject(err)
      )
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
        }, (err) => reject(err)
      )
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
        }
      )
    })
  }
}

export default Students
