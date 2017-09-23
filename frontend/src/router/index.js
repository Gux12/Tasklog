import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasks from '@/components/Tasks'
import Login from '@/components/Login'
import store from '@/store'

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
      path: '/task/:type',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/task',
      redirect: '/task/active'
    },
    {
      path: '/log/:type',
      name: 'Logs',
      component: Hello
    },
    {
      path: '/log',
      redirect: '/log/active'
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
      redirect: '/task/active'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  console.log(to)
  console.log(`flag: ${flag}`)
  if (!flag) {
    await store.dispatch('user/initUserAsync')
    flag++
  }
  if (to.meta.auth !== false) {
    if (store.getters['user/isAuthed']) {
      next()
    } else {
      next('/login')
    }
  } else {
    console.log('/login')
    next()
  }
})

export default router
