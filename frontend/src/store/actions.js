import * as TaskAPI from '@/api/task'

const actions = {
  async initTasks ({commit, state}) {
    let tasks = await TaskAPI.findAllTask()
    commit('clearTasks')
    commit('setTasks', {tasks})
  },
  async addTaskAsync ({commit, state}, task) {
    task = await TaskAPI.addTask(task)
    commit('addTask', {task})
  },
  async deleteTaskAsync ({commit, state}, {task}) {
    await TaskAPI.deleteTask(task.uid)
    commit('deleteTask', {task})
  },
  async editTaskAsync ({commit, state}, {task, title}) {
    await TaskAPI.editTask(task.uid, {title})
    commit('editTask', {task, title})
  },
  async toggleTaskAsync ({commit, state}, {task}) {
    console.log(task.uid)
    await TaskAPI.editTask(task.uid, {done: !task.done})
    commit('toggleTask', {task})
  }
}

export default actions
