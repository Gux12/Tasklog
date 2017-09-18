var fs = require('fs')
var path = require('path')

if (!fs.existsSync(path.join(__dirname, 'databases'))) {
  fs.mkdirSync(path.join(__dirname, 'databases'), function (err) {
    if (err) {
      console.log(err)
      return
    }
  })
}

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(path.join(__dirname, 'databases', 'TaskDB.sqlite3'))
module.exports = db