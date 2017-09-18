let express = require('express')
let router = express.Router()
let path = require('path')
let crypto = require('crypto')
let DB = require('../databases/db')
let fs = require('fs')

router.get('/task', function (req, res, next) {
  DB.task.findAll(function (err, data) {
    if (!err) res.send({ResultCode: 0, Record: data})
    else res.send({ResultCode: 1, Record: err})
  })
})

router.post('/task', function (req, res, next) {
  // 获取query
  let data = req.body
  // 使用sha256 hash算法进行ID的计算
  var sha256 = crypto.createHash('sha256')
  sha256.update(data.toString() + new Date())
  data.uid = sha256.digest('hex')
  data.create_time = new Date().getTime()
  // 数据库添加一条
  DB.task.add(data, function (err, data1) {
    if (!err) res.send({ResultCode: 0, Record: data})
    else res.send({ResultCode: 1, Record: err})
  })
})

router.route('/task/:task_id')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    console.log(req.body, req.params)
    next()
  })
  .get(function (req, res, next) {
    DB.task.find(req.params.task_id, function (err, data) {
      if (!err) res.send({ResultCode: 0, Record: data})
      else res.send({ResultCode: 1, Record: err})
    })
  })
  .put(function (req, res, next) {
    if (req.body.done === true) {
      req.body.done_time = new Date().getTime()
    } else {
      req.body.done_time = null
    }
    DB.task.modify(req.params.task_id, req.body, function (err, data) {
      if (!err) res.send({ResultCode: 0, Record: data})
      else res.send({ResultCode: 1, Record: err})
    })
  })
  .post(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .delete(function (req, res, next) {
    DB.task.delete(req.params.task_id, function (err, data) {
      if (!err) res.send({ResultCode: 0, Record: data})
      else res.send({ResultCode: 1, Record: err})
    })
  })

router.get('/append_tasks', function (req, res, next) {
  let append = [{'text': '到达办公室开始工作', 'done': false, 'createTime': '2017-09-16T03:16:16.233Z'}, {
    'text': '吃完饭开始办公',
    'done': false,
    'createTime': '2017-09-16T06:28:52.761Z'
  }, {
    'text': 'node __dirname是当前脚本的绝对路径，使用path.join可以\'./\'或\'../\'之类的操作',
    'done': false,
    'createTime': '2017-09-16T07:40:52.103Z'
  }, {'text': '完成sqlite数据库搭建', 'done': false, 'createTime': '2017-09-16T18:09:48.985Z'}, {
    'text': 'ChangeIP动态域名解析服务注册',
    'done': false,
    'createTime': '2017-09-16T18:10:06.342Z'
  }, {'text': '起床开始工作', 'done': false, 'createTime': '2017-09-17T04:06:45.219Z'}, {
    'text': '中午在家吃了鸡蛋羹和芒果',
    'done': false,
    'createTime': '2017-09-17T04:07:04.809Z'
  }, {'text': '到希格玛大厦听腾讯公开课', 'done': false, 'createTime': '2017-09-17T06:35:36.896Z'}]
  let append_modified = append.map(function (val) {
    let sha256 = crypto.createHash('sha256')
    sha256.update(val.toString() + Math.random().toString())
    let item = {}
    item.uid = sha256.digest('hex')
    item.create_time = new Date(val.createTime).getTime()
    item.text = val.text
    return item
  })
  console.log(append_modified)
  DB.task.addAll(append_modified, function (err, data1) {
    if (!err) res.send({ResultCode: 0, Record: append_modified})
    else res.send({ResultCode: 1, Record: err})
  })
})

module.exports = router
