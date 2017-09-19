import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasklog from '@/components/Tasklog'

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
      name: 'Tasklog',
      component: Tasklog
    },
    {
      path: '/task',
      redirect: '/task/all'
    }
  ]
})
