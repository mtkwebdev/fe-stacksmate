import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import chartStore from './chartStore'

Vue.use(Vuex)

const MESH_API = process.env.VUE_APP_API_RISIDIO + '/mesh'
const STACKS_API = process.env.VUE_APP_STACKS_API

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const pat = JSON.parse(process.env.VUE_APP_WALLET_ALICE || '')
const kip = JSON.parse(process.env.VUE_APP_WALLET_BOB || '')
const mik = JSON.parse(process.env.VUE_APP_WALLET_CHARLIE || '')
const rik = JSON.parse(process.env.VUE_APP_WALLET_DOREEN || '')

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

export default new Vuex.Store({
  modules: {
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
    initApplication ({ dispatch }) {
      return new Promise(() => {
        dispatch('authStore/fetchMyAccount', { root: true })
        dispatch('fetchRates', { root: true })
        dispatch('chartStore/readApiData', { root: true })
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
    transferComplete ({ state, rootGetters }, paymentId) {
      return new Promise((resolve, reject) => {
        const authHeaders = rootGetters['rpayAuthStore/getAuthHeaders']
        axios.post(MESH_API + '/payment/stx-transfered/' + paymentId, null, { headers: authHeaders }).then(response => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
})
