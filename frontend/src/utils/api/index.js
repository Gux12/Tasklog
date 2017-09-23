import * as http from './http'

export async function get (url, data) {
  let resp = await http.get(u(url), data)
  return handleResponse(resp)
}

export async function post (url, data) {
  let resp = await http.post(u(url), data)
  return handleResponse(resp)
}

export async function deleteById (url, data) {
  let resp = await http.deleteById(u(url), data)
  return handleResponse(resp)
}

export async function put (url, data) {
  let resp = await http.put(u(url), data)
  return handleResponse(resp)
}

export async function postForm (url, data) {
  let resp = await http.postForm(u(url), data)
  return handleResponse(resp)
}

let u = url => `${url}`

// 处理 response
export function handleResponse (resp) {
  if (!resp.data || resp.data.ResultCode !== 0) {
    console.warn(resp.config.method, resp.config.url, resp.config.params, resp.config.data, resp.data)
    throw resp.data
  }
  return resp.data.Record
}
