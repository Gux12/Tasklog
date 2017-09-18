let Restful = function (keys, db, tableName) {
  // 所有键的字符创
  let keyString = ''
  keys.forEach(function (key, index) {
    keyString = keyString + key + (index === keys.length - 1 ? '' : ',')
  })

  // 把data的值转成按keys顺序排列的数组
  let dataToArray = function (keys, data) {
    return Array.apply(null, keys).map(function (val) {return data[val]})
  }
  // 多个问号字符串的生成 ?,?,?,?
  let qmString = function (n) {
    return Array.apply(null, new Array(n)).map(function () {return '?'}).toString()
  }
  // 添加一条
  this.add = function (data, cb) {
    if (data instanceof Object) {
    } else {
      data = JSON.parse(data)
    }
    console.log('INSERT OR REPLACE INTO ' + tableName + ' (' + keyString + ') VALUES (' + qmString(keys.length) + ')', dataToArray(keys, data))
    db.run('INSERT OR REPLACE INTO ' + tableName + ' (' + keyString + ') VALUES (' + qmString(keys.length) + ')', dataToArray(keys, data), cb)
  }
  // 添加多条
  this.addAll = function (data, cb) {
    if (data instanceof Object) {
    } else {
      data = JSON.parse(data)
    }
    db.serialize(function () {
      for (let val of data) {
        console.log('INSERT OR REPLACE INTO ' + tableName + ' (' + keyString + ') VALUES (' + qmString(keys.length) + ')', dataToArray(keys, val))
        db.run('INSERT OR REPLACE INTO ' + tableName + ' (' + keyString + ') VALUES (' + qmString(keys.length) + ')', dataToArray(keys, val))
      }
    })
  }
  // 查找所有的
  this.findAll = function (cb) {
    console.log('SELECT * FROM ' + tableName)
    db.all('SELECT * FROM ' + tableName, cb)
  }
  // 查找某条
  this.find = function (uid, cb) {
    console.log('SELECT * FROM ' + tableName + ' WHERE uid = ' + uid)
    db.get('SELECT * FROM ' + tableName + ' WHERE uid = ?', [uid], cb)
  }
  // 删除某条
  this.delete = function (uid, cb) {
    console.log('SELECT FROM ' + tableName + ' WHERE uid = ' + uid)
    db.get('DELETE FROM ' + tableName + ' WHERE uid = ?', [uid], cb)
  }
  // 修改某条
  this.modify = function (uid, data, cb) {
    if (data instanceof Object) {
      console.log('JSON Object')
    } else {
      console.log('JSON String')
      data = JSON.parse(data)
    }
    let setStirng = ' SET '
    let param = []
    let data_index = 0
    keys.forEach(function (key, index) {
      if (data[key] !== undefined) {
        setStirng += key + (data_index === Object.keys(data).length - 1 ? ' = ? ' : ' = ?, ')
        param.push(data[key])
        data_index++
      }
    })
    param.push(uid)
    console.log('UPDATE ' + tableName + setStirng + 'WHERE uid = ?', param)
    db.run('UPDATE ' + tableName + setStirng + 'WHERE uid = ?', param, cb)
  }
}

module.exports = Restful