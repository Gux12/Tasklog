let express = require('express')
let router = express.Router()
let router_task = require('./task')
let router_log = require('./log')
let router_content = require('./content')
let router_recycle_task = require('./recycle_task')
let router_recycle_log = require('./recycle_log')
router.use(function (req, res, next) {
  console.log('经过路由/api')
  next()
})
router.use('/task',router_task)
// router.use(router_log)
// router.use(router_content)
// router.use(router_recycle_task)
// router.use(router_recycle_log)

module.exports = router


