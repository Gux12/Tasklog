let Restful = require('./Restful')
let db = require('../database')

let recycle_log = new Restful(['uid', 'title', 'create_time', 'content_uid'], db, 'recycle_log')
module.exports = recycle_log