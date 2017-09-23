import map from 'lodash/map'
import isArrayLike from 'lodash/isArrayLike'
import isPlainObject from 'lodash/isPlainObject'

// clone equals toJSON 都将过滤掉 $$ 开头的属性

export function clone (object, ignoreUndefined = false) {
  // primary
  if (!object || typeof object !== 'object') return object
  // array-like
  if (isArrayLike(object)) {
    let r = map(object, item => clone(item, ignoreUndefined))
    if (ignoreUndefined) r = r.filter(data => data !== undefined)
    return r
  }
  if (!isPlainObject(object)) return object
  // object
  let res = {}
  Object.keys(object).forEach(key => {
    if (key.indexOf('$$') !== 0 && !(ignoreUndefined && object[ key ] === undefined)) {
      res[ key ] = clone(object[ key ], ignoreUndefined)
    }
  })
  return res
}

export function equals (a, b) {
  if (a === b) return true
  if (!a || !b || typeof a !== 'object') return false
  if (isArrayLike(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!equals(a[ i ], b[ i ])) return false
    return true
  }
  if (!isPlainObject(a) || !isPlainObject(b)) return false
  for (let key of Object.keys(a)) {
    if (key.indexOf('$$') !== 0 && (!b.hasOwnProperty(key) || !equals(a[ key ], b[ key ]))) return false
  }
  for (let key of Object.keys(b)) {
    if (key.indexOf('$$') !== 0 && !a.hasOwnProperty(key)) return false
  }
  return true
}

export let toJSON = (object, space) => {
  return JSON.stringify(object, (key, value) => {
    if (key.indexOf('$$') !== 0) return value
  }, space)
}
