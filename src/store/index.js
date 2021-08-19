import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import paymentStore from './paymentStore'
import contentStore from './contentStore'
import { APP_CONSTANTS } from '@/app-constants'

Vue.use(Vuex)

const precision = 100000000
const precisionStx = 1000000
const getAmounts = function (currency, amountFiat, tickerRates, cryptoFixed) {
  try {
    const rate = tickerRates.find((o) => o.currency === currency)
    const amountBtc = amountFiat / rate.last
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })
    const amounts = {
      currency: currency,
      amountFiatFormatted: formatter.format(amountFiat),
      amountFiat: amountFiat,
      amountBtc: Math.round(amountBtc * precision) / precision,
      amountSat: Math.round(amountBtc * precision),
      amountEth: Math.round((amountFiat / rate.ethPrice) * precision) / precision,
      amountStx: Math.round((amountFiat / rate.stxPrice) * precisionStx) / precisionStx
    }
    return amounts
  } catch {
    return {}
  }
}

const payment = {
  forceNew: false,
  amountFiat: 2,
  amountEth: 2,
  amountBtc: 2,
  amountStx: 2,
  currency: 'GBP',
  paymentCode: 'po-12324',
  allowMultiples: false,
  stxPaymentAddress: process.env.VUE_APP_STACKS_PAYMENT_ADDRESS,
  ethPaymentAddress: process.env.VUE_APP_ETH_PAYMENT_ADDRESS,
  ethNetworkId: Number(process.env.VUE_APP_ETH_NETWORK_ID),
  paymentOption: '',
  paymentOptions: [
    { allowFiat: true, disabled: false },
    { allowPaypal: true, disabled: true },
    { allowBitcoin: true, disabled: false },
    { allowLightning: true, disabled: false },
    { allowStacks: false, disabled: true },
    { allowLSAT: false, disabled: true },
    { allowEthereum: true, disabled: false }
  ],
  creditAttributes: {
    start: 1,
    step: 2,
    min: 2,
    max: 20
  },
  squarePay: {
    applicationId: process.env.VUE_APP_SQUARE_APPLICATION_ID,
    locationId: process.env.VUE_APP_SQUARE_LOCATION_ID,
    squareUrl: process.env.VUE_APP_VUE_APP_SQUARE_URL
  }
}
const setup = function (data) {
  let risidioCardMode = 'payment-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const NETWORK = process.env.VUE_APP_NETWORK
  // let beneficiaries = []
  const risidioBaseApi = process.env.VUE_APP_RISIDIO_API
  const configuration = {
    minter: {},
    payment: payment,
    network: NETWORK,
    risidioProjectId: process.env.VUE_APP_STACKS_CONTRACT_ADDRESS + '.' + process.env.VUE_APP_STACKS_CONTRACT_NAME,
    risidioBaseApi: risidioBaseApi,
    risidioStacksApi: process.env.VUE_APP_STACKS_API,
    risidioWalletMac: process.env.VUE_APP_WALLET_MAC,
    risidioWalletSky: process.env.VUE_APP_WALLET_SKY,
    risidioCardMode: risidioCardMode
  }
  // window.risidioPaymentConfig = JSON.stringify(configuration)
  return configuration
}

export default new Vuex.Store({
  modules: {
    paymentStore,
    contentStore
  },
  state: {
    chromeLink: 'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    firefoxLink: 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/',
    webWalletNeeded: false,
    proof: '?proof=0',
    baseCurrency: 'GBP',
    fiatCurrency: 'GBP',
    baseAmount: 2,
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight }
  },
  getters: {
    getWebWalletLinkChrome: state => {
      return state.chromeLink
    },
    getWebWalletLinkFirefox: state => {
      return state.firefoxLink
    },
    getLocalConfiguration: state => {
      state.configuration.payment = payment
      state.configuration.payment.amountFiat = state.baseAmount
      state.configuration.payment.currency = state.baseCurrency
      return state.configuration
    },
    getWebWalletNeeded: state => {
      return state.webWalletNeeded
    },
    getModalMessage: state => {
      return state.modalMessage
    },
    getAmounts: (state, getters, rootState, rootGetters) => {
      const tickerRates = rootGetters[APP_CONSTANTS.KEY_TICKER_RATES_UNFILTERED]
      if (!tickerRates || tickerRates.length === 0) return
      const baseRate = tickerRates.find((o) => o.currency === state.baseCurrency)
      const fiatRate = tickerRates.find((o) => o.currency === state.fiatCurrency)
      const fiatAmount = (fiatRate.last / baseRate.last) * state.baseAmount
      const amounts = {
        baseAmounts: getAmounts(state.baseCurrency, state.baseAmount, tickerRates, false),
        // fiatAmounts: getAmounts(state.configuration.payment.currency, fiatAmount, tickerRates)
        fiatAmounts: getAmounts(state.fiatCurrency, fiatAmount, tickerRates, true)
      }
      return amounts
    }
  },
  mutations: {
    setRpayFlow (state, data) {
      const config = setup(data)
      state.configuration = config
    },
    setWebWalletNeeded (state) {
      state.webWalletNeeded = true
    },
    setModalMessage (state, modalMessage) {
      state.modalMessage = modalMessage
    },
    setWinDims (state) {
      state.windims = {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight
      }
    },
    setFiatCurrency (state, fiatCurrency) {
      state.fiatCurrency = fiatCurrency
    }
  },
  actions: {
    fetchAddressInfo ({ state }, stxAddress) {
      return new Promise((resolve, reject) => {
        let stacksNode = process.env.VUE_APP_STACKS_API
        stacksNode += '/v2/accounts/' + stxAddress + state.proof
        axios.get(stacksNode).then((result) => {
          resolve(result)
        }).catch(() => {
          reject(new Error('Address not registered on: ' + process.env.VUE_APP_NETWORK))
        })
      })
    },
    initApplication ({ state, dispatch }) {
      return new Promise((resolve) => {
        dispatch('rpayAuthStore/fetchMyAccount').then((profile) => {
          // dispatch('rpayStore/initialisePaymentFlow', state.configuration)
          resolve(profile)
        })
      })
    }
  }
})
