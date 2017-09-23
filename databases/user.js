let Restful = require('./Restful')
let db = require('../bin/database')

let user = new Restful(['uid', 'username', 'pwd'], db, 'user')
module.exports = user