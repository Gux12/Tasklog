let express = require('express')
let router = express.Router()
let path = require('path')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render(path.join(__dirname, '../views/index.jade'), { title: 'Express' });
// });

router.get('/task', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

module.exports = router
