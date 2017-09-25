export let set = (localData) => {
  for (let [item, index] of localData) {
    localStorage.setItem(index, item)
  }
}// 设置数据
export let get = (localData) => {
  let obj = {}
  for (let item of localData) {
    obj[item] = localStorage.getItem(item)
  }
  return obj
}// 取出数据
export let remove = (localData) => {
  for (let item of localData) {
    localStorage.removeItem(item)
  }
}// 删除数据
