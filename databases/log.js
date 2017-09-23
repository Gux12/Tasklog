let Restful = require('./Restful')
let db = require('../bin/database')

let log = new Restful(['uid', 'title', 'create_time', 'content_uid'], db, 'log')
module.exports = log