var fs = require('fs')
var file = 'data.db'
fs.existsSync(file)
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(file)

db.insert = function (sql, params) {
  let p = new Promise((resolve, reject) => {
    db.run(sql, params, (err, data) => {
      if (err != null) {
        console.log(err)
        alert(err)
        reject(err)
      } else {
        this.get('select last_insert_rowid()', {}, (err2, data) => {
          resolve(data['last_insert_rowid()'])
        })
      }
    })
  })
  return p
}

db.query = function (sql, params) {
  let p = new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err != null) {
        console.log(err)
        alert(err)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
  return p
}

db.exec = function (sql, params) {
  let p = new Promise((resolve, reject) => {
    db.run(sql, params, err => {
      if (err != null) {
        console.log(err)
        alert(err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
  return p
}

/** **********************deprecated**********************  **/
db.insert = function (sql, params, callback) {
  db.run(sql, params, (err, data) => {
    if (err != null) {
      console.log(err)
      alert(err)
    } else if (callback != null) {
      this.get('select last_insert_rowid()', {}, (err2, data) => {
        callback(data['last_insert_rowid()'])
      })
    }
  })
}
db.query = function (sql, params, callback) {
  db.all(sql, params, (err, rows) => {
    if (err != null) {
      console.log(err)
      alert(err)
    } else if (callback != null) {
      callback(rows)
    }
  })
}
db.exec = function (sql, params, callback) {
  let p = new Promise((resolve, reject) => {
    db.run(sql, params, err => {
      resolve()
      if (err != null) {
        console.log(err)
        alert(err)
      } else if (callback != null) {
        callback()
      }
    })
  })
  return p
}
/** **********************deprecated end**********************  **/

let createTableSqlScript = [
  'create table if not exists customer_group(' +
    'id integer primary key autoincrement,' +
    'label text not null,' +
    'parent_id integer)',
  'create table if not exists customer(' +
    'id integer primary key autoincrement,' +
    'group_id integer not null,' +
    'name text not null,' +
    'country text,' +
    'addr text,' +
    'company text,' +
    'phone text,' +
    'email text,' +
    'level integer,' +
    'website text,' +
    'introduce text,' +
    'create_time integer)',
  'create table if not exists dict(' +
    'id integer primary key autoincrement,' +
    'label text,' +
    'type text,' +
    'sequence integer)',
  'create table if not exists enquiry(' +
    'id integer primary key autoincrement,' +
    'customer_id integer,' +
    'content text,' +
    'quote integer,' +
    'create_time integer)',
  'create table if not exists follow(' +
    'id integer primary key autoincrement,' +
    'enquiry_id integer,' +
    'content text,' +
    'create_time integer)'
]

let initSqlScript = [
]

let p = Promise.resolve(true)
createTableSqlScript.map(val => {
  p = p.then(() => {
    return db.exec(val)
  })
})
p.then(() => {
  db.hasInit = true
})

initSqlScript.forEach(val => {
  db.exec(val)
})

export default db
