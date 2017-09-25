export let set = (sessionData) => {
  for (let [item, index] of sessionData) {
    sessionStorage.setItem(index, item)
  }
}// 设置数据
export let get = (sessionData) => {
  let obj = {}
  for (let item of sessionData) {
    obj[item] = sessionStorage.getItem(item)
  }
  return obj
}// 取出数据
export let remove = (sessionData) => {
  for (let item of sessionData) {
    sessionStorage.removeItem(item)
  }
}// 删除数据
