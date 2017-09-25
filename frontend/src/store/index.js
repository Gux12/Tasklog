import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations'
import actions from './actions'
import plugins from './plugins'
import user from './modules/user'
import log from './modules/log'

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins,
  modules: {
    user, log
  }
})
