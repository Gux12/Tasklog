import axios from 'axios'
import * as qs from 'qs'
import { clone } from './lang'

/*
请求过滤掉 undefined；
请求需要过滤掉以 `$$` 开头的属性，$$开头的属性一般用于保存前端的状态，不需要发给后台
如图书列表，如果正在编辑某一项，ui中为了突出该项正在编辑，需要加个属性 item.$$editing=true，
此时如果要保存该项，可以直接 post('book/edit', item)，则 $$editing 属性并不会发送给后台
 */
export let cleanData = object => clone(object, true)

export function get (url, data) {
  let params = cleanData(data)
  return axios.get(url, {params})
}

export function post (url, data) {
  data = cleanData(data)
  console.log(url, data)
  return axios.post(url, data)
}

export function put (url, data) {
  data = cleanData(data)
  return axios.put(url, data)
}

export function deleteById (url, data) {
  let params = cleanData(data)
  return axios.delete(url, {params})
}

export function postForm (url, data) {
  data = cleanData(data)
  let params = qs.stringify(data, {indices: false})
  return axios.post(url, params)
}
