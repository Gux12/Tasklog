import * as api from '@/utils/api'

export let findAllLog = options => api.get('/api/log/list' + options)

export let addLog = params => api.post('/api/log/item', params)

export let deleteLog = uid => api.deleteById('/api/log/item' + uid)

export let findLog = uid => api.post('/api/log/item' + uid)

export let editLog = (uid, params) => api.put('/api/log/item' + uid, params)
