import createLogger from 'vuex/dist/logger'

const localStoragePlugin = store => {
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger()]
  : [localStoragePlugin]
