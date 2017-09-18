let Restful = require('./Restful')
let db = require('../database')

let content = new Restful(['uid', 'html'], db, 'content')
module.exports = content