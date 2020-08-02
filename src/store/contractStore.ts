// ethStore.js
import store from './index'
import contractService from '@/services/contractService'

const PAYMENT_STATUS_FREE_CREDITS = Number(process.env.VUE_APP_SESSION_PAYMENT_STATUS_FREE_CREDITS)
const NUMB_ENTICERS = Number(process.env.VUE_APP_SESSION_NUMB_ENTICERS)
const NUMB_FREE_CREDITS = Number(process.env.VUE_APP_SESSION_NUMB_FREE_CREDITS)

const contractStore = {
  namespaced: true,
  state: {
    initialised: false,
    rootFile: null,
    apiKey: 'risidio-01234',
    creditAttributes: {
      amountFiatPerCredit: 0.3,
      fiatCurrency: 'EUR',
      useCredits: true,
      start: 2,
      step: 2,
      min: 2,
      max: 20
    },
    paymentOptions: { mainOption: 'ethereum', allowLightning: false, allowEthereum: true, allowBitcoin: false, allowStacks: false },
    loopSession: null,
    freeSession: { freeSessionInProgress: false, freeSessionUsed: true }
  },
  getters: {
    getTempUserId: (state: { tempUserId: any }) => {
      if (state.tempUserId) {
        const tuid = localStorage.getItem('RADICLE_TUID') || ''
        return JSON.parse(tuid)
      }
      return ''
    },
    getConfiguration: (state: { rootFile: { sessions: any[] }; apiKey: any; paymentOptions: { mainOption: any }; creditAttributes: any }) => (opcode: any) => {
      const session = state.rootFile.sessions[0]
      return {
        apiKey: state.apiKey,
        status: session.status,
        paymentId: session.paymentId,
        paymentOptions: state.paymentOptions,
        paymentOption: state.paymentOptions.mainOption,
        opcode: opcode,
        creditAttributes: state.creditAttributes
      }
    },
    paymentOptions: (state: { paymentOptions: any }) => {
      return state.paymentOptions
    },
    getLoopSession: (state: { rootFile: { sessions: any[] } }) => {
      return state.rootFile.sessions[0]
    },
    getFreeSession: (state: { freeSession: any }) => {
      if (state.freeSession) {
        return state.freeSession
      }
      return { freeSessionInProgress: false, freeSessionUsed: true }
    },
    getRootFile: (state: { rootFile: any }) => {
      return state.rootFile
    },
    isInitialised: (state: { initialised: any }) => {
      return state.initialised
    },
    isGameOn: (state: { rootFile: { sessions: { clientData: any }[] } }) => {
      const cd = state.rootFile.sessions[0].clientData
      return cd.creditsUsed < cd.creditsPurchased
    },
    isPaid: (state: { rootFile: { sessions: { status: number }[] } }) => {
      return state.rootFile.sessions[0].status > 3
    },
    getCredits: (state: { rootFile: { sessions: { clientData: any }[] } }) => {
      const cd = state.rootFile.sessions[0].clientData
      return { used: cd.creditsUsed, purchased: cd.creditsPurchased }
    },
    getTestSpin: (state: { rootFile: { sessions: { status: number }[] } }) => {
      const profile = store.getters['authStore/getMyProfile']
      if (!profile.loggedIn) {
        return true
      }
      // let hasCredits = state.loopSession.clientData.creditsUsed <= state.loopSession.clientData.creditsPurchased
      return state.rootFile.sessions[0].status === 3
    },
    getAmountFiatPerSpin: (state: { creditAttributes: { amountFiatPerSpin: any } }) => {
      return state.creditAttributes.amountFiatPerSpin
    }
  },
  mutations: {
    initialised (state: { initialised: boolean }) {
      state.initialised = true
    },
    paymentOptions (state: { paymentOptions: any }, paymentOptions: any) {
      state.paymentOptions = paymentOptions
    },
    freeSession (state: { freeSession: any }, freeSession: any) {
      state.freeSession = freeSession
    },
    rootFile (state: { rootFile: any }, rootFile: any) {
      state.rootFile = rootFile
    },
    numbCredits (state: { numbCredits: any }, numbCredits: any) {
      state.numbCredits = numbCredits
    }
  },
  actions: {
    initApplication ({ commit }: any, loggedIn: any) {
      return new Promise((resolve) => {
        contractService.initSchema(loggedIn).then((rootFile: any) => {
          commit('rootFile', rootFile)
          const loopSession = rootFile.sessions[0]
          const enticers = rootFile.sessions.filter((sess: { status: number }) => sess.status === PAYMENT_STATUS_FREE_CREDITS)
          const freeSessionUsed = enticers.length >= NUMB_ENTICERS || loopSession.clientData.creditsUsed >= loopSession.clientData.creditsPurchased
          const freeSession = {
            freeSessionUsed: freeSessionUsed,
            freeSessionInProgress: loopSession.clientData.creditsUsed > 0 && loopSession.status === PAYMENT_STATUS_FREE_CREDITS
          }
          commit('freeSession', freeSession)
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

    startFreeSession ({ commit, state }: any) {
      return new Promise(resolve => {
        const loopSession = state.rootFile.sessions[0]
        loopSession.clientData.creditsPurchased = NUMB_FREE_CREDITS
        loopSession.status = PAYMENT_STATUS_FREE_CREDITS
        loopSession.testSpin = false
        loopSession.freeSessionUsed = true
        contractService.updateSession(state.rootFile).then((rootFile: any) => {
          state.freeSession.freeSessionUsed = false
          state.freeSession.freeSessionInProgress = true
          commit('rootFile', rootFile)
          commit('freeSession', state.freeSession)
          resolve(loopSession)
        })
          .catch(() => {
            resolve(loopSession)
          })
      })
    },

    receivePayment ({ commit, state }: any, data: { status: any; paymentId: any; numbCredits: any; opcode: string }) {
      return new Promise(resolve => {
        const loopSession = state.rootFile.sessions[0]
        loopSession.status = (data.status) ? data.status : 3
        loopSession.testSpin = loopSession.status === 3
        loopSession.paymentId = data.paymentId
        loopSession.clientData.creditsPurchased = data.numbCredits
        contractService.updateSession(state.rootFile).then(rootFile => {
          commit('rootFile', rootFile)
          if (data.opcode === 'lsat-payment-confirmed') {
            resolve(true)
          } else {
            resolve(false)
          }
        })
          .catch(() => {
            resolve(loopSession)
          })
      })
    },

    startNewSession ({ commit, state }: any, profile: { loggedIn: any }) {
      return new Promise((resolve) => {
        const loopSession = state.rootFile.sessions[0]
        if (!profile.loggedIn) {
          loopSession.testSpin = true
          loopSession.clientData = { creditsPurchased: state.creditAttributes.start, creditsUsed: 0 }
          contractService.updateSession(state.rootFile).then(rootFile => {
            commit('rootFile', rootFile)
            resolve(loopSession)
          })
        } else {
          if (loopSession.status === 3 && !loopSession.paymentId) {
            loopSession.testSpin = true
            loopSession.clientData = { creditsPurchased: state.creditAttributes.start, creditsUsed: 0 }
            contractService.updateSession(state.rootFile).then(rootFile => {
              commit('rootFile', rootFile)
              resolve(loopSession)
            })
          } else {
            contractService.newSession(state.rootFile).then(rootFile => {
              commit('rootFile', rootFile)
              resolve(loopSession)
            })
          }
        }
      })
    },

    updateAssets ({ commit, state }: any, data: { assetHash: any }) {
      return new Promise(resolve => {
        const loopSession = state.rootFile.sessions[0]
        if (!loopSession.paymentId) {
          // enticer session
          return
        }
        loopSession.clientData.assets = (loopSession.clientData.assets) ? loopSession.clientData.assets : []
        loopSession.clientData.assets.push(data.assetHash)
        contractService.updateAssets(loopSession.paymentId, data.assetHash).then(loopSession => {
          contractService.updateSession(state.rootFile).then(rootFile => {
            commit('rootFile', rootFile)
            resolve(loopSession)
          })
        })
          .catch(() => {
            resolve()
          })
      })
    },

    debitSession ({ commit, state }: any) {
      return new Promise((resolve) => {
        const loopSession = state.rootFile.sessions[0]
        if (loopSession.clientData.creditsUsed < loopSession.clientData.creditsPurchased) {
          loopSession.clientData.creditsUsed = loopSession.clientData.creditsUsed + 1
          contractService.updateSession(state.rootFile).then(rootFile => {
            commit('rootFile', rootFile)
            resolve(loopSession)
          })
        } else {
          resolve(loopSession)
        }
      })
    },
    storeGlobalConfig ({ commit }: any, config: any) {
      return new Promise((resolve) => {
        contractService.storeGlobalConfig(config).then((config: any) => {
          commit('paymentOptions', config.paymentOptions)
          resolve(config)
        })
      })
    }
  }
}
export default contractStore
