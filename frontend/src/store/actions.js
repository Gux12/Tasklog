import * as TaskAPI from '@/api/task'

const actions = {
  async initTasks ({commit, state}, options) {
    let tasks = await TaskAPI.findAllTask('/' + options)
    let countActive = await TaskAPI.count('/done?value=0')
    let countCompleted = await TaskAPI.count('/done?value=1')
    commit('setCount', {countActive, countCompleted})
    commit('clearTasks')
    commit('appendTasks', {tasks})
  },
  async appendTasksAsync ({commit, state}, options) {
    let tasks = await TaskAPI.findAllTask('/' + options)
    commit('appendTasks', {tasks})
  },
  async addTaskAsync ({commit, state}, task) {
    task = await TaskAPI.addTask(task)
    commit('addTask', {task})
  },
  async deleteTaskAsync ({commit, state}, {task}) {
    await TaskAPI.deleteTask('/' + task.uid)
    commit('deleteTask', {task})
  },
  async editTaskAsync ({commit, state}, {task, title}) {
    await TaskAPI.editTask('/' + task.uid, {title})
    commit('editTask', {task, title})
  },
  async toggleTaskAsync ({commit, state}, {task}) {
    let newTask = await TaskAPI.editTask('/' + task.uid, {done: !task.done})
    commit('toggleTask', {task, newTask})
  }
}

export default actions
