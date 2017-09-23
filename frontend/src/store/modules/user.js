import * as UserAPI from '@/api/user'

export default {
  namespaced: true,
  state: {user: null},
  mutations: {
    initUser (state, user) {
      console.log(user)
      state.user = user
    }
  },
  actions: {
    async initUserAsync ({commit, state}) {
      try {
        let user = await UserAPI.profile()
        commit('initUser', user)
      } catch (e) {
        commit('initUser', null)
      }
    },
    async logout ({commit}) {
      await UserAPI.logout()
      commit('initUser', null)
    },
    async login ({commit}, {username, pwd}) {
      let user = await UserAPI.login({username, pwd})
      commit('initUser', user)
    }
  },
  getters: {
    isAuthed: state => {
      return !!state.user
    }
  }
}
