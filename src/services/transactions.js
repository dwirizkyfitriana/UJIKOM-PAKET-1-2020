import { Parse } from './parseConfig'

class Transactions {
  static async getAllTransactions() {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Transaction')
      let q = new Parse.Query(Tb)

      q.descending('createdAt')
      q.doesNotExist('deletedAt')
      q.include('student.major')
      q.include('student.class')
      q.include('student.schoolYears')

      q.find().then(
        (res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        },
        (err) => reject(err)
      )
    })
  }

  static async getTransactionsById(id) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Transaction')
      let q = new Parse.Query(Tb)

      q.equalTo('objectId', id)
      q.include('student.major')
      q.include('student.class')
      q.include('student.schoolYears')

      q.find().then(
        (res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        },
        (err) => reject(err)
      )
    })
  }

  static async getTransactionsByStudentId(studentId) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Transaction')
      let q = new Parse.Query(Tb)

      q.descending('createdAt')
      q.doesNotExist('deletedAt')
      q.include('student.major')
      q.include('student.class')
      q.include('student.schoolYears')
      q.equalTo('student', {
        __type: 'Pointer',
        className: 'Student',
        objectId: studentId,
      })

      q.find().then(
        (res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        },
        (err) => reject(err)
      )
    })
  }

  static async addTransaction(month, data) {
    return new Promise((resolve, reject) => {
      const Tb = Parse.Object.extend('Transaction')
      let q = new Tb()

      
      let today = new Date()
      let dd = String(today.getDate()).padStart(2, '0')
      let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      let yyyy = today.getFullYear()

      today = dd + mm + yyyy
      console.log('TRX-' + today + Math.floor(100 + Math.random() * 900))

      let serial = 'TRX-' + today + Math.floor(100 + Math.random() * 900)

      q.set('statusid', 1)
      q.set('serialCode', serial)
      q.set('month', month)
      q.set('amountPay', data.schoolYears.amountPaid)
      q.set('student', {__type: 'Pointer', className: 'Student', objectId: data.objectId})

      q.save().then(
        (res) => {
          resolve(JSON.parse(JSON.stringify(res)))
        },
        (err) => reject(err)
      )
    })
  }
}

export default Transactions
