import * as api from '@/utils/api'

export let login = params => api.post('/api/user/login', params)

export let logout = () => api.post('/api/user/logout')

export let profile = () => api.get('/api/user/profile')
