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
  this.findAll = function (options, cb) {
    // 查询返回升序降序选项
    let orderString = ' ORDER BY '
    if (options.orders !== undefined) {
      let orders = options.orders
      let newOrders = []
      for (let order of orders) {
        let retStr = order.order ? (order.key + ' ' + order.order) : ''
        if (retStr !== '') newOrders.push(retStr)
      }
      if (newOrders.length) {
        newOrders.map(function (order, index) {
          orderString += (index === 0 || order === '' ? '' : ', ') + order
        })
      } else {
        orderString = ''
      }
    }
    // 查询范围选项
    let scaleString = ' WHERE '
    if (options.scales !== undefined) {
      let scales = options.scales
      let newScales = []
      for (let scale of scales) {
        let retStr
        if (scale.value !== null) {
          retStr = `${scale.key}=${scale.value}`
        } else {
          retStr = (scale.start !== null ? (scale.key + ' >= ' + scale.start) : '') +
            ((scale.start === null || scale.end === null) ? '' : ' AND ') +
            (scale.end !== null ? (scale.key + ' <= ' + scale.end) : '')
        }
        if (retStr !== '') newScales.push(retStr)
      }

      if (newScales.length) {
        newScales.map(function (scale, index) {
          scaleString += (index === 0 ? '' : ' AND ') + scale
        })
      } else {
        scaleString = ''
      }
    }
    console.log('SELECT * FROM ' + tableName + scaleString + orderString)
    db.all('SELECT * FROM ' + tableName + scaleString + orderString, cb)
  }
  // 查找某条
  this.find = function (key, value, cb) {
    console.log(`SELECT * FROM ${tableName} WHERE ${key} = ${value}`)
    db.get(`SELECT * FROM ${tableName} WHERE ${key} = ?`, [value], cb)
  }
  // 删除某条
  this.delete = function (uid, cb) {
    console.log('SELECT FROM ' + tableName + ' WHERE uid = ' + uid)
    db.get('DELETE FROM ' + tableName + ' WHERE uid = ?', [uid], cb)
  }
  // 修改某条
  this.modify = function (uid, data, cb) {
    let setStirng = ' SET '
    // 参数值
    let paramVal = []
    // 参数键
    let paramKey = []
    keys.forEach(function (key, index) {
      if (data[key] !== undefined) {
        paramKey.push(key)
        paramVal.push(data[key])
      }
    })
    for (let i = 0; i < paramKey.length; i++) {
      console.log(paramKey[i])
      setStirng += paramKey[i] + (i === paramKey.length - 1 ? ' = ? ' : ' = ?, ')
    }
    paramVal.push(uid)
    console.log('UPDATE ' + tableName + setStirng + 'WHERE uid = ?', paramVal)
    db.run('UPDATE ' + tableName + setStirng + 'WHERE uid = ?', paramVal, cb)
  }
}

module.exports = Restful