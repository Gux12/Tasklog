let Restful = require('./Restful')
let db = require('../bin/database')

let task = new Restful(['uid', 'title', 'create_time', 'content_uid', 'done', 'done_time','user_uid'], db, 'task')
module.exports = task