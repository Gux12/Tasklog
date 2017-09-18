let Restful = require('./Restful')
let db = require('../database')

let task = new Restful(['uid', 'title', 'create_time', 'content_uid', 'done', 'done_time'], db, 'task')
module.exports = task