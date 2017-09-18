let Restful = require('./Restful')
let db = require('../database')

let recycle_task = new Restful(['uid', 'title', 'create_time', 'content_uid', 'done', 'done_time'], db, 'recycle_task')
module.exports = recycle_task