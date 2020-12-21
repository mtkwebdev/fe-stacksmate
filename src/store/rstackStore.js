import rstackService from '@/services/rstackService'

/**
const stopListening = function () {
  if (stompClient) stompClient.disconnect()
}

const startListening = function () {
  if (!socket) return
  socket = new SockJS(API_PATH + '/mesh/ws1/mynews')
  stompClient = Stomp.over(socket)
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/mynews-' + paymentId, function (response) {
      const paymentChallenge = JSON.parse(response.body)
      store.commit('addPaymentChallenge', paymentChallenge)
    })
    stompClient.subscribe('/queue/rates', function (response) {
      const rates = JSON.parse(response.body)
      store.commit('addRates', rates)
    })
  },
  function (error) {
    console.log(error)
  })
}
**/
const rstackStore = {
  namespaced: true,
  state: {
    initialised: false,
    rootFile: null,
    transaction: null,
    stackingFile: null
  },
  getters: {
    getRootFile: (state) => {
      return state.rootFile
    },
    getStackingFile: (state) => {
      return state.stackingFile
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
    },
    setStackingFile (state, stackingFile) {
      state.stackingFile = stackingFile
    }
  },
  actions: {
    initApplication ({ commit }, loggedIn) {
      return new Promise((resolve) => {
        rstackService.initSchema(loggedIn).then((rootFile) => {
          rstackService.initStacking(loggedIn).then((stackingFile) => {
            commit('setStackingFile', stackingFile)
          })
          const transaction = rootFile.transactions[0]
          commit('rootFile', rootFile)
          commit('initialised')
          resolve(transaction)
        })
      })
    },
    saveBtcAddress ({ state, commit }, btcAddress) {
      return new Promise((resolve, reject) => {
        state.stackingFile.btcAddress = btcAddress
        rstackService.checkBitcoinAddress(btcAddress).then((result) => {
          if (!result) {
            reject(new Error('Bitcoin address not valid'))
          } else {
            rstackService.saveStackingFile(state.stackingFile).then((stackingFile) => {
              commit('stackingFile', stackingFile)
              resolve(stackingFile)
            })
          }
        })
      })
    },
    saveToGaia ({ state, commit }, txData) {
      return new Promise((resolve) => {
        const item = state.rootFile.transactions.find(item => item.txData.result === txData.result)
        if (item) {
          resolve(item)
          return
        }
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile.transactions[0])
        })
      })
    },
    saveMacaroon ({ state, commit }, txData) {
      return new Promise((resolve) => {
        const item = state.rootFile.transactions.find(item => item.txData.preimage === txData.preimage)
        if (item) {
          resolve(item)
          return
        }
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile.transactions[0])
        })
      })
    }
  }
}
export default rstackStore
