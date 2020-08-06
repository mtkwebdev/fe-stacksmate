import contractService from '@/services/contractService'

const contractStore = {
  namespaced: true,
  state: {
    initialised: false,
    rootFile: null
  },
  getters: {
    getRootFile: (state) => {
      return state.rootFile
    },
    getContractHistory: (state) => {
      return (state.rootFile) ? state.rootFile.contracts : null
    },
    isInitialised: (state) => {
      return state.initialised
    }
  },
  mutations: {
    initialised (state) {
      state.initialised = true
    },
    rootFile (state, rootFile) {
      state.rootFile = rootFile
    }
  },
  actions: {
    initApplication ({ commit }, loggedIn) {
      return new Promise((resolve) => {
        contractService.initSchema(loggedIn).then((rootFile) => {
          const loopSession = rootFile.contracts[0]
          commit('rootFile', rootFile)
          commit('initialised')
          resolve(loopSession)
        })
        /**
        contractService.fetchGlobalConfig().then(config => {
          if (config && config.paymentOptions) {
            commit('paymentOptions', config.paymentOptions)
          }
        })
        **/
      })
    },
    storeGlobalConfig ({ commit }, config) {
      return new Promise((resolve) => {
        contractService.storeGlobalConfig(config).then((config) => {
          commit('paymentOptions', config.paymentOptions)
          resolve(config)
        })
      })
    }
  }
}
export default contractStore
