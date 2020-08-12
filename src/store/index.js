import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import transactionStore from './transactionStore'
import authStore from './authStore'
import store from './index'
import contractStore from './contractStore'
import rates from 'risidio-rates'

Vue.use(Vuex)

const MESH_API = process.env.VUE_APP_MESH_API
const MESH_API_RISIDIO = process.env.VUE_APP_MESH_API_RISIDIO

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const alice = JSON.parse(process.env.VUE_APP_WALLET_ALICE || '')
const bob = JSON.parse(process.env.VUE_APP_WALLET_BOB || '')
const charlie = JSON.parse(process.env.VUE_APP_WALLET_CHARLIE || '')
const doreen = JSON.parse(process.env.VUE_APP_WALLET_DOREEN || '')

export default new Vuex.Store({
  modules: {
    transactionStore: transactionStore,
    authStore: authStore,
    contractStore: contractStore
  },
  state: {
    xgeRates: null,
    playMode: false,
    fiatCurrency: 'EUR',
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    response: null,
    status: true,
    currentAccount: null,
    wallets: [mac, alice, bob, charlie, doreen],
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
    getExchangeRate: state => {
      if (!state.xgeRates) {
        return null
      }
      return state.xgeRates.find(item => item.fiatCurrency === state.fiatCurrency)
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
    }
  },
  mutations: {
    setStatus (state, status) {
      state.status = status
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
    setBalance (state, data) {
      const wallet = state.wallets.find(item => item.keyInfo.address === data.address)
      if (wallet) {
        wallet.balance = data.balance
        wallet.nonce = data.nonce
      }
    }
  },
  actions: {
    initApplication ({ commit }) {
      return new Promise(resolve => {
        store.dispatch('fetchRates')
        store.dispatch('authStore/fetchMyAccount').then((profile) => {
          if (profile.loggedIn) {
            store.dispatch('contractStore/initApplication', profile.loggedIn).then(() => {
              resolve(profile)
            })
          } else {
            store.dispatch('contractStore/initApplication', profile.loggedIn).then(() => {
              resolve()
            })
          }
          // store.dispatch('fetchServerTime')
        })
      })
    },
    fetchRates ({ commit }, data) {
      return new Promise((resolve, reject) => {
        rates.fetchSTXRates().then((rates) => {
          commit('setXgeRates', rates)
        })
        setInterval(function () {
          rates.fetchSTXRates().then((rates) => {
            commit('setXgeRates', rates)
          })
        }, 3600000)
      })
    },
    fireEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const provider = store.getters['authStore/getProvider']
        const useApi = (provider === 'risidio') ? MESH_API_RISIDIO : MESH_API
        axios.post(useApi + '/v2/accounts', data).then(response => {
          resolve(response.data)
        }).catch((error) => {
          const msg = error.response.data.status + ' - ' + error.response.data.message
          reject(msg)
        })
      })
    },
    fetchWalletInfo ({ commit }, address) {
      return new Promise((resolve, reject) => {
        const data = {
          path: '/v2/accounts/' + address,
          httpMethod: 'get',
          postData: null
        }
        const provider = store.getters['authStore/getProvider']
        const useApi = (provider === 'risidio') ? MESH_API_RISIDIO : MESH_API
        axios.post(useApi + '/v2/accounts', data).then(response => {
          const info = response.data
          info.address = address
          info.nonce = response.data.nonce
          info.balance = parseInt(response.data.balance, 16)
          commit('setBalance', info)
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
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
    }
  }
})
