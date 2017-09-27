let express = require('express')
let router = express.Router()
let crypto = require('crypto')
let DB = require('../../databases/db')
let qs = require('querystring')

const options = {
  orders: [],
  scales: []
}

// 查询所有的任务
router.get('/list', function (req, res, next) {
  DB.task.findAll({
    orders: [],
    scales: []
  }, function (err, data) {
    if (!err) res.send({ResultCode: 0, Record: data, Message: '获取任务列表成功'})
    else res.send({ResultCode: 1, Record: err, Message: '获取任务列表失败'})
  })
})
// 查询所有的任务数量
router.get('/count', function (req, res, next) {
  DB.task.count({
    orders: [],
    scales: []
  }, function (err, data) {
    if (!err) res.send({ResultCode: 0, Record: data[0]['count(*)'], Message: null})
    else res.send({ResultCode: 1, Record: err, Message: '获取任务数量失败'})
  })
})

// 查询所有的任务中符合条件的
function convert_options (req, res, next) {
  for (let url of req.url.split('/')) {
    if (url !== '' && url !== 'list' && url != 'count') {
      let resObj = {
        order: {
          key: '',
          order: ''
        },
        scale: {
          key: '',
          start: '',
          end: '',
          value: ''
        }
      }
      let json = qs.parse(url.split('?')[1])
      console.log(json)
      let KEY = url.split('?')[0]
      for (let key1 in resObj) {
        for (let key2 in resObj[key1]) {
          if (key2 === 'key') resObj[key1][key2] = KEY
          else {
            resObj[key1][key2] = json[key2] ? json[key2] : null
          }
        }
        options[key1 + 's'].push(resObj[key1])
      }
    }
  }
  next()
}

router.get('/list/:options', convert_options, function (req, res) {
  DB.task.findAll(options, function (err, data) {
    if (!err) res.send({ResultCode: 0, Record: data, Message: '获取过滤任务列表成功'})
    else res.send({ResultCode: 1, Record: err, Message: '获取过滤任务列表失败'})
  })
  options.orders = []
  options.scales = []
})

router.get('/count/:options', convert_options, function (req, res) {
  DB.task.count(options, function (err, data) {
    if (!err) res.send({ResultCode: 0, Record: data[0]['count(*)'], Message: null})
    else res.send({ResultCode: 1, Record: err, Message: '获取任务数失败'})
  })
  options.orders = []
  options.scales = []
})

router.post('/item', function (req, res) {
  // 获取query
  let data = req.body
  // 使用sha256 hash算法进行ID的计算
  var sha256 = crypto.createHash('sha256')
  sha256.update(data.toString() + new Date())
  data.uid = sha256.digest('hex')
  data.create_time = new Date().getTime()
  // 数据库添加一条
  DB.task.add(data, function (err, data1) {
    if (!err) res.send({ResultCode: 0, Record: data, Message: '添加任务成功'})
    else res.send({ResultCode: 1, Record: err, Message: '添加任务失败'})
  })
})

router.route('/item/:task_id')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    console.log(req.body, req.params)
    next()
  })
  .get(function (req, res, next) {
    DB.task.find('uid', req.params.task_id, function (err, data) {
      if (!err) res.send({ResultCode: 0, Record: data, Message: `获取任务${req.params.task_id}成功`})
      else res.send({ResultCode: 1, Record: err, Message: `获取任务${req.params.task_id}失败`})
    })
  })
  .put(function (req, res, next) {
    if (req.body.done === true) {
      req.body.done_time = new Date().getTime()
    } else {
      req.body.done_time = null
    }
    DB.task.modify(req.params.task_id, req.body, function (err, data) {
      if (!err) {
        DB.task.find('uid', req.params.task_id, function (err, data) {
          if (!err) res.send({ResultCode: 0, Record: data, Message: `修改任务成功`})
          else res.send({ResultCode: 1, Record: err, Message: `获取修改任务失败`})
        })
      }
      else res.send({ResultCode: 1, Record: err, Message: `修改任务成功`})
    })
  })
  .post(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .delete(function (req, res, next) {
    DB.task.delete(req.params.task_id, function (err, data) {
      if (!err) res.send({ResultCode: 0, Record: data, Message: `删除任务成功`})
      else res.send({ResultCode: 1, Record: err, Message: `删除任务失败`})
    })
  })

module.exports = router
