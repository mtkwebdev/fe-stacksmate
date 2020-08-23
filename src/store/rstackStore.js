import rstackService from '@/services/rstackService'

const rstackStore = {
  namespaced: true,
  state: {
    initialised: false,
    rootFile: null,
    transaction: null
  },
  getters: {
    getRootFile: (state) => {
      return state.rootFile
    },
    getTransactionHistory: (state) => {
      return (state.rootFile) ? state.rootFile.transactions : []
    },
    getCurrentTransaction: (state) => {
      return state.transaction
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
    },
    setCurrentTransaction (state, transaction) {
      state.transaction = transaction
    }
  },
  actions: {
    initApplication ({ commit }, loggedIn) {
      return new Promise((resolve) => {
        rstackService.initSchema(loggedIn).then((rootFile) => {
          const transaction = rootFile.transactions[0]
          commit('rootFile', rootFile)
          commit('initialised')
          resolve(transaction)
        })
      })
    },
    saveTransfer ({ state, commit }, txData) {
      return new Promise((resolve) => {
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile)
        })
      })
    },
    saveMacaroon ({ state, commit }, txData) {
      return new Promise((resolve) => {
        const item = state.rootFile.transactions.find(item => item.txData.preimage === txData.preimage)
        if (item) {
          resolve(state.rootFile)
          return
        }
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile)
        })
      })
    }
  }
}
export default rstackStore
