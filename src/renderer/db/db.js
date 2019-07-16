var fs = require('fs')
var file = 'test.db'
fs.existsSync(file)
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(file)

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
  db.run(sql, params, err => {
    if (err != null) {
      console.log(err)
      alert(err)
    } else if (callback != null) {
      callback()
    }
  })
}

let createTableSqlScript = [
  'create table if not exists customer_group(' +
    'id integer primary key autoincrement,' +
    'label text not null,' +
    'parent_id integer)'
]

let initSqlScript = [
]

createTableSqlScript.forEach(val => {
  console.log(val)
  db.exec(val)
})

initSqlScript.forEach(val => {
  db.exec(val)
})

export default db
