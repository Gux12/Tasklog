import * as http from './http'
import { Toast, Indicator } from 'mint-ui'

export async function get (url, data) {
  Indicator.open()
  try {
    let resp = await http.get(u(url), data)
    return handleResponse(resp)
  } catch (e) {
    handleError(e)
  }
}

export async function post (url, data) {
  Indicator.open()
  try {
    let resp = await http.post(u(url), data)
    return handleResponse(resp)
  } catch (e) {
    handleError(e)
  }
}

export async function deleteById (url, data) {
  Indicator.open()
  try {
    let resp = await http.deleteById(u(url), data)
    return handleResponse(resp)
  } catch (e) {
    handleError(e)
  }
}

export async function put (url, data) {
  Indicator.open()
  try {
    let resp = await http.put(u(url), data)
    return handleResponse(resp)
  } catch (e) {
    handleError(e)
  }
}

export async function postForm (url, data) {
  Indicator.open()
  try {
    let resp = await http.postForm(u(url), data)
    return handleResponse(resp)
  } catch (e) {
    handleError(e)
  }
}

function handleError (e) {
  let error = e
  console.log(e)
  if (e.ResultCode === 1) {
    error = e.Message
    if (error) {
      Toast({
        message: error,
        duration: 1000
      })
    }
  } else {
    Toast(error)
  }
  Indicator.close()
}

let u = url => `${url}`

// 处理 response
export function handleResponse (resp) {
  Indicator.close()
  if (!resp.data || resp.data.ResultCode !== 0) {
    console.warn(resp.config.method, resp.config.url, resp.config.params, resp.config.data, resp.data)
    throw resp.data
  }
  Toast({
    message: resp.data.Message,
    duration: 1000
  })
  return resp.data.Record
}
