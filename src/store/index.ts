import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import transactionStore from './transactionStore'
import authStore from './authStore'
import store from './index'
import {
  UserSession
} from 'blockstack'
import contractStore from './contractStore'

Vue.use(Vuex)

const MESH_API = process.env.VUE_APP_MESH_API

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const alice = JSON.parse(process.env.VUE_APP_WALLET_ALICE || '')
const bob = JSON.parse(process.env.VUE_APP_WALLET_BOB || '')
const charlie = JSON.parse(process.env.VUE_APP_WALLET_CHARLIE || '')
const doreen = JSON.parse(process.env.VUE_APP_WALLET_DOREEN || '')
const userSession = new UserSession()
/**
const authHeaders = function (configuration: { apiKey: any }) {
  let authResponseToken
  let decodedToken
  let publicKey
  let token = 'v1:no-token' // note: not all requests require auth token - e.g. getPaymentAddress
  if (userSession.isUserSignedIn()) {
    const account = userSession.loadUserData()
    if (account) {
      authResponseToken = account.authResponseToken
      decodedToken = decodeToken(authResponseToken)
      token = 'v1:' + account.authResponseToken
    }
  }
  const headers = {
    ApiKey: configuration.apiKey,
    IdentityAddress: publicKey,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  return headers
}
**/

export default new Vuex.Store({
  modules: {
    transactionStore: transactionStore,
    authStore: authStore,
    contractStore: contractStore
  },
  state: {
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    account: null,
    apiKey: 'blockstack-loopbomb-01234',
    creditAttributes: {
      amountFiatPerCredit: 0.5,
      fiatCurrency: 'EUR',
      useCredits: true,
      start: 2,
      step: 2,
      min: 2,
      max: 20
    },
    paymentOptions: { mainOption: 'ethereum', allowLightning: false, allowEthereum: true, allowBitcoin: false, allowStacks: false },
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
    getLsatConfiguration: state => (opcode: string) => {
      return {
        apiKey: state.apiKey,
        ratesWatch: true,
        opcode: opcode,
        paymentOptions: state.paymentOptions,
        paymentOption: state.paymentOptions.mainOption,
        creditAttributes: state.creditAttributes
      }
    },
    getLsatLoginConfiguration: state => {
      return {
        apiKey: state.apiKey,
        ratesWatch: true,
        opcode: 'login',
        paymentOptions: state.paymentOptions,
        paymentOption: state.paymentOptions.mainOption,
        creditAttributes: state.creditAttributes
      }
    },
    getResponse: state => {
      return state.response
    },
    getEndpoints: state => (type: string) => {
      const ep = state.endpoints.find(item => item.type === type)
      return (ep) ? ep.values : null
    },
    getWallet: state => (address: string) => {
      const wallet = state.wallets.find(item => item.keyInfo.address === address)
      return wallet
    },
    getCurrentAccount: state => {
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
    addResponse (state, response) {
      state.response = response
    },
    setAccount (state, account) {
      state.account = account
    },
    setBalance (state, data) {
      const wallet = state.wallets.find(item => item.keyInfo.address === data.address)
      if (wallet) {
        wallet.balance = data.balance
      }
    }
  },
  actions: {
    initApplication ({ commit }) {
      return new Promise(resolve => {
        const account = userSession.loadUserData()
        store.dispatch('authStore/fetchMyAccount').then((profile) => {
          commit('setAccount', account)
          if (profile.loggedIn) {
            // store.dispatch('myItemStore/initSchema')
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
    fireEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const account = userSession.loadUserData()
        axios.post(MESH_API + '/v2/accounts', data).then(response => {
          commit('setAccount', account)
          commit('addResponse', response.data)
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
        axios.post(MESH_API + '/v2/accounts', data).then(response => {
          const info = response.data
          info.address = address
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
