let express = require('express')
let router = express.Router()
let DB = require('../../databases/db')

router.post('/login',
  function (req, res, next) {
    let reqUser = Object.keys(req.body).length ? req.body : req.query
    DB.user.find('username', reqUser.username, function (err, user) {
      if (err) res.send({ResultCode: 1, Record: null, Message: '未知'})
      else if (!user) res.send({ResultCode: 1, Record: null, Message: '没有该用户'})
      else if (user.pwd !== reqUser.pwd) res.send({ResultCode: 1, Record: null, Message: '密码不对'})
      else {
        user.sessionViews = req.session.views
        user.sessionID = req.sessionID
        req.session.user = user
        res.send({ResultCode: 0, Record: user})
      }
    })
  })

router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    // cannot access session here
    if (err) res.send({ResultCode: 1, Record: err})
    else res.send({ResultCode: 0, Record: null})
  })
})

router.post('/profile', function (req, res, next) {
  if (req.session.user) {
    var user = req.session.user
    res.send({ResultCode: 0, Record: user})
  } else {
    res.send({ResultCode: 1, Record: null, Message: '未登录'})
  }
})

module.exports = router