import * as http from './http'
import { Indicator } from 'mint-ui'
import { Notification } from 'element-ui'

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
      Notification.error({
        message: error,
        duration: 1000
      })
    }
  } else {
    Notification.error({
      message: error['message'],
      duration: 1000
    })
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
  if (resp.data.Message) {
    Notification.success({
      message: resp.data.Message,
      duration: 1000
    })
  }
  return resp.data.Record
}
