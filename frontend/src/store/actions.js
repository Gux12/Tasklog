import * as TaskAPI from '@/api/task'
import { getRandomColor } from '@/utils/color'

const actions = {
  async initTasks ({commit, state}, options) {
    let tasks = await TaskAPI.findAllTask('/' + options)
    let countActive = await TaskAPI.count('/done?value=0')
    let countCompleted = await TaskAPI.count('/done?value=1')
    for (let task of tasks) {
      let tags = task.title.match(/#([^#]+)#/g)
      if (tags != null) {
        for (let index in tags) {
          tags[index] = {
            text: tags[index].match(/#([^#]+)#/)[1],
            color: await getRandomColor(tags[index].match(/#([^#]+)#/)[1])
          }
        }
      }
      task.tags = tags
      task.tagsFree = task.title.replace(/#([^#]+)#/g, '')
    }
    commit('setCount', {countActive, countCompleted})
    commit('clearTasks')
    commit('appendTasks', {tasks})
  },
  async appendTasksAsync ({commit, state}, options) {
    let tasks = await TaskAPI.findAllTask('/' + options)
    for (let task of tasks) {
      let tags = task.title.match(/#([^#]+)#/g)
      if (tags != null) {
        for (let index in tags) {
          tags[index] = {
            text: tags[index].match(/#([^#]+)#/)[1],
            color: await getRandomColor(tags[index].match(/#([^#]+)#/)[1])
          }
        }
      }
      task.tags = tags
      task.tagsFree = task.title.replace(/#([^#]+)#/g, '')
    }
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
    let tags = title.match(/#([^#]+)#/g)
    if (tags != null) {
      for (let index in tags) {
        tags[index] = {
          text: tags[index].match(/#([^#]+)#/)[1],
          color: await getRandomColor(tags[index].match(/#([^#]+)#/)[1])
        }
      }
    }
    let tagsFree = title.replace(/#([^#]+)#/g, '')
    commit('editTask', {task, title, tags, tagsFree})
  },
  async toggleTaskAsync ({commit, state}, {task}) {
    let newTask = await TaskAPI.editTask('/' + task.uid, {done: !task.done})
    commit('toggleTask', {task, newTask})
  }
}

export default actions
