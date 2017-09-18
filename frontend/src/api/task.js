import * as api from '@/utils/api'

export let findAllTask = () => api.get('/api/task')

export let addTask = params => api.post('/api/task', params)

export let deleteTask = uid => api.deleteById('/api/task/' + uid)

export let findTask = uid => api.post('/api/task/' + uid)

export let editTask = (uid, params) => api.put('/api/task/' + uid, params)
