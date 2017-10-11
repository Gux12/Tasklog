import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasks from '@/components/Tasks'
import Logs from '@/components/Logs'
import Login from '@/components/Login'
import store from '@/store'
// import { sessionStorage } from '@/utils/storage'

Vue.use(Router)
let flag = 0

const router = new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        auth: false
      },
      component: Login
    },
    {
      path: '/task/:type/:tags',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/task/:type',
      redirect: '/task/active/全部'
    },
    {
      path: '/task',
      redirect: '/task/active/全部'
    },
    {
      path: '/log',
      name: 'Logs',
      component: Logs
    },
    {
      path: '/recycle/:type',
      name: 'Recycles',
      component: Hello
    },
    {
      path: '/recycle',
      redirect: '/recycle/active'
    },
    {
      path: '*',
      redirect: '/hello'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // 每次刷新页面的时候flag初始化为0所以会触发一次后端验证
  // 后端采用不过期session，只要登录一次cookie永久保留
  if (!flag) {
    await store.dispatch('user/initUserAsync')
    flag++
  }
  // console.log(`from '${from.path}' to '${to.path}'`)
  if (store.getters['user/isAuthed']) {
    if (to.path === '/login') next(false)
    else next()
  } else {
    if (to.meta.auth === false) next()
    else next('/login')
  }
})

export default router
