import * as api from '@/utils/api'

export let findAllTask = options => api.get('/api/task/list' + options)

export let addTask = params => api.post('/api/task/item', params)

export let deleteTask = uid => api.deleteById('/api/task/item' + uid)

export let findTask = uid => api.post('/api/task/item' + uid)

export let editTask = (uid, params) => api.put('/api/task/item' + uid, params)

export let count = options => api.get('/api/task/count' + options)
