import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasks from '@/components/Tasks'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
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
