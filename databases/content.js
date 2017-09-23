let Restful = require('./Restful')
let db = require('../bin/database')

let content = new Restful(['uid', 'html'], db, 'content')
module.exports = content