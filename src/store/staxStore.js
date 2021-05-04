import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import transactionStore from './transactionStore'
import chartStore from './chartStore'
import authStore from './authStore'
import store from './staxStore'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'

Vue.use(Vuex)

const MESH_API = process.env.VUE_APP_API_RISIDIO + '/mesh'
const STACKS_API = process.env.VUE_APP_STACKS_API
const API_PATH = process.env.VUE_APP_API_RISIDIO

let socket = null
let stompClient = null

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const pat = JSON.parse(process.env.VUE_APP_WALLET_ALICE || '')
const kip = JSON.parse(process.env.VUE_APP_WALLET_BOB || '')
const mik = JSON.parse(process.env.VUE_APP_WALLET_CHARLIE || '')
const rik = JSON.parse(process.env.VUE_APP_WALLET_DOREEN || '')

const websockCheck = function (paymentChallenge) {
  let allow = false
  if (paymentChallenge.paymentId && paymentChallenge.paymentId !== 'null') {
    if (paymentChallenge.serviceKey === 'stacks-lightning-exchange') {
      if (paymentChallenge.serviceStatus === -1 && paymentChallenge.status === 5) {
        allow = true
      }
    }
  }
  return allow
}
const precision = 1000000
const getAmountStx = function (amountMicroStx) {
  try {
    if (typeof amountMicroStx === 'string') {
      amountMicroStx = Number(amountMicroStx)
    }
    if (amountMicroStx === 0) return 0
    amountMicroStx = amountMicroStx / precision
    return Math.round(amountMicroStx * precision) / precision
  } catch {
    return 0
  }
}
const getFeeEstimate = function () {
  try {
    const fee = 3000 / precision
    return Math.round(fee * precision) / precision
  } catch {
    return 0
  }
}

const updatePaymentChallenge = function (paymentChallenge) {
  return new Promise(resolve => {
    const authHeaders = store.getters['authStore/getAuthHeaders']
    axios.put(API_PATH + '/lsat/v1/payment', paymentChallenge, { headers: authHeaders }).then(response => {
      resolve(response.data)
    })
  })
}
export default new Vuex.Store({
  modules: {
    transactionStore: transactionStore,
    authStore: authStore,
    chartStore: chartStore
  },
  state: {
    xgeRates: null,
    playMode: false,
    fiatCurrency: 'EUR',
    shakerData: null,
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    response: null,
    status: true,
    transfer: null,
    currentAccount: null,
    feeEstimate: null,
    wallets: [mac, pat, kip, mik, rik],
    endpoints: [
      {
        type: 'account',
        values: [
          { value: 'Choose Enpoint', text: 'Choose Option' },
          { value: '/sidecar/v1/address/{address}/balances', text: 'Get account balances' },
          { value: '/sidecar/v1/address/{address}/transactions', text: 'Get account transactions' },
          { value: '/sidecar/v1/address/{address}/assets', text: 'Get account assets' },
          { value: '/v2/accounts/{address}', text: 'Get account info' },
          { value: '/v2/info', text: 'Get Core API info' },
          { value: '/sidecar/v1/status', text: 'Get Blockchain API status' },
          { value: '/v2/fees/transfer', text: 'Get fee estimation / byte' }
        ]
      },
      {
        type: 'contract',
        values: [
          { value: 'Choose Enpoint', text: 'Choose Option' },
          { value: '/sidecar/v1/contract/{contract_id}', text: 'Get contract info' },
          { value: '/sidecar/v1/contract/{contract_id}/events', text: 'Get contract events' },
          { value: '/v2/contracts/interface/{stacks_address}/{contract_name}', text: 'Get contract interface' },
          { value: '/v2/map_entry/{stacks_address}/{contract_name}/{map_name}', text: 'Get contract data map' },
          { value: '/v2/contracts/source/{stacks_address}/{contract_name}', text: 'Get contract source' },
          { value: '/v2/contracts/call-read/{stacks_address}/{contract_name}/{function_name}', text: 'Call read-only function' }
        ]
      },
      {
        type: 'faucet',
        values: [
          { value: null, text: 'Choose Faucet Endpoint' },
          { value: '/sidecar/v1/faucets/stx/{address}', method: 'post', text: 'Get testnet STX tokens' },
          { value: '/sidecar/v1/faucets/btc/{address}', method: 'post', text: 'Get testnet BTC tokens' }
        ]
      },
      {
        type: 'deployment',
        values: [
          { value: '/v2/transactions', method: 'post', text: 'Broadcast raw transaction' }
        ]
      },
      {
        type: 'transaction',
        values: [
          { value: null, text: 'Choose Transaction Endpoint' },
          { value: '/sidecar/v1/tx', text: 'Get most recent (<= 200) transactions' },
          { value: '/sidecar/v1/tx/stream?protocol={protocol}', text: 'Stream transaction events' },
          { value: '/sidecar/v1/tx/{txid}', text: 'Get transaction' }
        ]
      },
      {
        type: 'block',
        values: [
          { value: null, text: 'Choose Blocks Endpoint' },
          { value: '/sidecar/v1/block/{blockhash}', method: 'get', text: 'Get block' },
          { value: '/sidecar/v1/block', text: 'Get recent blocks' }
        ]
      }
    ]
  },
  getters: {
    getExchangeRates: state => {
      return state.xgeRates
    },
    getSectionHeight: state => {
      return (state.windims.innerHeight)
    },
    getSectionWidth: state => {
      return (state.windims.innerWidth)
    },
    getFeeEstimate: state => {
      return state.feeEstimate
    },
    getExchangeRate: state => {
      if (!state.xgeRates) {
        return null
      }
      return state.xgeRates.find(item => item.currency === state.fiatCurrency)
    },
    getFiatCurrency: state => {
      return state.fiatCurrency
    },
    getResponse: state => {
      return state.response
    },
    getPlayMode: state => {
      return state.playMode
    },
    getEndpoints: state => (type) => {
      const ep = state.endpoints.find(item => item.type === type)
      return (ep) ? ep.values : null
    },
    getWallet: state => (address) => {
      const wallet = state.wallets.find(item => item.keyInfo.address === address)
      return wallet
    },
    getTestWallet: state => {
      const wallet = state.wallets.find(item => item.keyInfo.address === state.currentAccount)
      return wallet
    },
    getNonEmptyWallets: state => {
      const wallets = state.wallets.filter(item => item.balance > 0)
      // wallets.splice(0, state.wallets.length - 1, { value: '', text: 'Choose Sender', balance: 0, sk: '' })
      return wallets
    },
    getWallets: state => {
      return state.wallets
    },
    getShakerData: (state) => {
      return state.shakerData
    }
  },
  mutations: {
    setStatus (state, status) {
      state.status = status
    },
    setWinDims (state) {
      state.windims = {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight
      }
    },
    setCurrentAccount (state, currentAccount) {
      state.currentAccount = currentAccount
    },
    setXgeRates (state, xgeRates) {
      state.xgeRates = xgeRates
    },
    setFiatCurrency (state, fiatCurrency) {
      state.fiatCurrency = fiatCurrency
    },
    setPlayMode (state) {
      state.playMode = !state.playMode
    },
    setTransfer (state, transfer) {
      state.transfer = transfer
    },
    setFeeEstimate (state, feeEstimate) {
      state.feeEstimate = getFeeEstimate() // blockstack return 1 here???
    },
    setBalance (state, data) {
      const wallet = state.wallets.find(item => item.keyInfo.address === data.address)
      if (wallet) {
        wallet.balance = data.balance
        wallet.nonce = data.nonce
      }
    },
    addWallet (state, wallet) {
      const wallet1 = state.wallets.find(item => item.keyInfo.address === wallet.keyInfo.address)
      if (wallet1) {
        throw new Error('Wallet with this address already exists.')
      }
      state.wallets.push(wallet)
    },
    setShakerData (state, shakerData) {
      state.shakerData = shakerData
    }
  },
  actions: {
    initApplication ({ commit }) {
      return new Promise(() => {
        store.dispatch('authStore/fetchMyAccount')
        store.dispatch('fetchRates')
        store.dispatch('chartStore/readApiData')
      })
    },
    fetchRates ({ commit }) {
      return new Promise(() => {
        axios.get(MESH_API + '/v1/rates/ticker').then(response => {
          commit('setXgeRates', response.data)
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    fetchFeeEstimate ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const data = { path: '/v2/fees/transfer', httpMethod: 'get', postData: null }
        axios.post(STACKS_API + '/v2/accounts', data).then(response => {
          resolve(response.data)
          commit('setFeeEstimate', response.data)
        }).catch((error) => {
          if (error.response && error.response.data) {
            const msg = error.response.data.status + ' - ' + error.response.data.message
            reject(msg)
          } else {
            reject(error)
          }
        })
      })
    },
    fireEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.post(STACKS_API + '/v2/accounts', data).then(response => {
          resolve(response.data)
        }).catch((error) => {
          const msg = error.response.data.status + ' - ' + error.response.data.message
          reject(msg)
        })
      })
    },
    fetchWalletInfo ({ commit }, address) {
      return new Promise((resolve, reject) => {
        if (address) {
          reject(new Error('Balanaces not available atm'))
          return
        }
        const data = {
          path: '/v2/accounts/' + address,
          httpMethod: 'get',
          postData: null
        }
        axios.post(STACKS_API + '/v2/accounts', data).then(response => {
          const info = response.data
          info.address = address
          info.nonce = response.data.nonce
          info.balance = getAmountStx(parseInt(response.data.balance, 16))
          commit('setBalance', info)
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    createOrImportWallet ({ commit }, wallet) {
      return new Promise((resolve, reject) => {
        commit('addWallet', wallet)
        resolve(wallet)
      })
    },
    fetchWalletBalances ({ state, dispatch, commit }) {
      return new Promise((resolve) => {
        let counter = 0
        this.state.wallets.forEach(function (wallet) {
          if (wallet.keyInfo && wallet.keyInfo.address) {
            dispatch('fetchWalletInfo', wallet.keyInfo.address).catch(() => {
              commit('setStatus', false)
            })
          }
          counter++
          if (counter === state.wallets.length) {
            resolve()
          }
        })
      })
    },
    transferComplete ({ state }, paymentId) {
      return new Promise((resolve, reject) => {
        const authHeaders = store.getters['authStore/getAuthHeaders']
        axios.post(MESH_API + '/payment/stx-transfered/' + paymentId, null, { headers: authHeaders }).then(response => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    startWebsockets ({ state, commit }, profile) {
      return new Promise((resolve) => {
        if (!profile.superAdmin) {
          resolve()
        }
        socket = new SockJS(API_PATH + '/lsat/ws1/transfers')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, function () {
          stompClient.subscribe('/queue/transfers-' + state.shakerData.address, function (response) {
            const paymentChallenges = JSON.parse(response.body)
            if (!paymentChallenges || !Array.isArray(paymentChallenges)) {
              return
            }
            paymentChallenges.forEach(function (paymentChallenge) {
              if (websockCheck(paymentChallenge)) {
                // match means users payment has been received
                // now transfer x stx to users address..
                // then update the payment challenge to set serviceStatus = 1 ie paid
                // add the txid of the transfer for users records.
                let amount = 0
                if (paymentChallenge.serviceData && paymentChallenge.serviceData.numbCredits) {
                  amount = paymentChallenge.serviceData.numbCredits
                }
                if (!paymentChallenge.serviceData || !amount) {
                  paymentChallenge.serviceStatus = -2
                  updatePaymentChallenge(paymentChallenge)
                } else {
                  const data = {
                    recipient: paymentChallenge.serviceData.stxAddress,
                    amount: amount,
                    senderKey: state.shakerData.privateKey,
                    memo: 'Payment for ' + amount + ' STX tokens.'
                  }
                  store.dispatch('fetchWalletInfo', state.shakerData.address).then((response) => {
                    data.nonce = response.data.nonce
                    store.dispatch('authStore/makeTransferRisidio', data).then((result) => {
                      if (result) {
                        // store.dispatch('transferComplete', paymentChallenge.paymentId)
                        paymentChallenge.serviceStatus = 1
                        paymentChallenge.serviceData.transferTx = result
                        updatePaymentChallenge(paymentChallenge)
                        commit('addTransfer', paymentChallenge)
                      }
                    })
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              } else {
                paymentChallenge.serviceStatus = 2
                paymentChallenge.serviceData.transferTx = 'no-transfer'
                updatePaymentChallenge(paymentChallenge)
              }
            })
          })
        },
        function (error) {
          console.log(error)
        })
      })
    },
    stopWebsockets ({ state, dispatch, commit }) {
      if (stompClient) stompClient.disconnect()
    }
  }
})
