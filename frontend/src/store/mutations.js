export const state = {tasks: [], count: {countActive: 0, countCompleted: 0}}

export const mutations = {
  appendTasks (state, {tasks}) {
    tasks.forEach(function (task) {
      state.tasks.push(task)
    })
    state.tasks.sort(function (a, b) {
      return b.create_time - a.create_time
    })
  },
  clearTasks (state) {
    state.tasks = []
  },
  addTask (state, {task}) {
    state.tasks.push(task)
    state.tasks.sort(function (a, b) {
      return b.create_time - a.create_time
    })
    state.count.countActive++
  },
  deleteTask (state, {task}) {
    state.tasks.splice(state.tasks.indexOf(task), 1)
    if (!task.done) state.count.countActive--
    else state.count.countCompleted--
  },
  toggleTask (state, {task, newTask}) {
    task.done = newTask.done
    task.done_time = newTask.done_time
    if (task.done) {
      state.count.countActive--
      state.count.countCompleted++
    } else {
      state.count.countActive++
      state.count.countCompleted--
    }
  },
  editTask (state, {task, title}) {
    task.title = title
  },
  setCount (state, {countActive, countCompleted}) {
    state.count.countActive = countActive
    state.count.countCompleted = countCompleted
  }
}
