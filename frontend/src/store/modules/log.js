import * as LogAPI from '@/api/log'

export default {
  namespaced: true,
  state: {logs: []},
  mutations: {
    appendLogs (state, {logs}) {
      logs.forEach(function (log) {
        state.logs.push(log)
      })
      state.logs.sort(function (a, b) {
        return b.create_time - a.create_time
      })
    },
    clearLogs (state) {
      state.logs = []
    },
    addLog (state, {log}) {
      state.logs.push(log)
      state.logs.sort(function (a, b) {
        return b.create_time - a.create_time
      })
    },
    deleteLog (state, {log}) {
      state.logs.splice(state.logs.indexOf(log), 1)
    },
    editLog (state, {log, title}) {
      log.title = title
    }
  },
  actions: {
    async initLogs ({commit, state}, options) {
      let logs = await LogAPI.findAllLog('/' + options)
      commit('clearLogs')
      commit('appendLogs', {logs})
    },
    async appendLogsAsync ({commit, state}, options) {
      let logs = await LogAPI.findAllLog('/' + options)
      commit('appendLogs', {logs})
    },
    async addLogAsync ({commit, state}, log) {
      log = await LogAPI.addLog(log)
      commit('addLog', {log})
    },
    async deleteLogAsync ({commit, state}, {log}) {
      await LogAPI.deleteLog('/' + log.uid)
      commit('deleteLog', {log})
    },
    async editLogAsync ({commit, state}, {log, title}) {
      await LogAPI.editLog('/' + log.uid, {title})
      commit('editLog', {log, title})
    }
  }
}
