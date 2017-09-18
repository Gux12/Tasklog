export const state = {tasks: []}

export const mutations = {
  setTasks (state, {tasks}) {
    tasks.forEach(function (task) {
      state.tasks.push(task)
    })
  },
  clearTasks (state) {
    state.tasks = []
  },
  addTask (state, {task}) {
    state.tasks.push(task)
  },
  deleteTask (state, {task}) {
    state.tasks.splice(state.tasks.indexOf(task), 1)
  },

  toggleTask (state, {task}) {
    task.done = !task.done
  },

  editTask (state, {task, title}) {
    task.title = title
  },

  toggleAll (state, {done}) {
    state.tasks.forEach((task) => {
      task.done = done
    })
  },
  clearCompleted (state) {
    state.tasks = state.tasks.filter(task => !task.done)
  }
}
