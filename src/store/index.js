import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import paymentStore from './paymentStore'

Vue.use(Vuex)

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API
const APPLICATION_ID = process.env.VUE_APP_SQUARE_APPLICATION_ID
const LOCATION_ID = process.env.VUE_APP_SQUARE_LOCATION_ID
const SQUARE_URL = process.env.VUE_APP_VUE_APP_SQUARE_URL
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_MINT_FUNCTION = process.env.VUE_APP_STACKS_MINT_FUNCTION
const ETH_CONTRACT_ADDRESS = process.env.VUE_APP_NFT_CONTRACT_ADDRESS
const RISIDIO_WALLET_MAC = process.env.VUE_APP_WALLET_MAC
const RISIDIO_WALLET_SKY = process.env.VUE_APP_WALLET_SKY
const RISIDIO_STACKS_API = process.env.VUE_APP_STACKS_API

const precision = 100000000
const getAmounts = function (currency, amountFiat, tickerRates) {
  try {
    const rate = tickerRates.find((o) => o.currency === currency)
    const amountBtc = amountFiat / rate.last
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })
    const amounts = {
      currency: currency,
      amountFiat: formatter.format(amountFiat),
      amountBtc: Math.round(amountBtc * precision) / precision,
      amountSat: Math.round(amountBtc * precision),
      amountEth: Math.round((amountFiat / rate.ethPrice) * precision) / precision,
      amountStx: Math.round((amountFiat / rate.stxPrice) * precision) / precision
    }
    return amounts
  } catch {
    return {}
  }
}

const payment = {
  forceNew: false,
  amountFiat: 5,
  amountEth: 5,
  amountBtc: 5,
  amountStx: 5,
  currency: 'GBP',
  paymentCode: 'po-12324',
  allowMultiples: false,
  stxPaymentAddress: process.env.VUE_APP_STACKS_PAYMENT_ADDRESS,
  ethPaymentAddress: process.env.VUE_APP_ETH_PAYMENT_ADDRESS,
  paymentOption: 'unchosen',
  paymentOptions: [
    { allowFiat: true },
    { allowBitcoin: true },
    { allowLightning: true },
    { allowStacks: false },
    { allowLSAT: false },
    { allowEthereum: true }
  ],
  creditAttributes: {
    start: 1,
    step: 2,
    min: 2,
    max: 20
  },
  squarePay: {
    applicationId: APPLICATION_ID,
    locationId: LOCATION_ID,
    squareUrl: SQUARE_URL
  }
}
const minter = {
  preferredNetwork: 'stacks risidio',
  networks: [
    {
      network: 'stacks connect',
      enabled: true,
      functionName: STX_MINT_FUNCTION,
      contractAddress: STX_CONTRACT_ADDRESS,
      contractName: STX_CONTRACT_NAME
    },
    {
      network: 'ethereum',
      enabled: true,
      functionName: 'mint-token',
      contractAddress: ETH_CONTRACT_ADDRESS
    }
  ],
  enableRoyalties: false,
  beneficiaries: []
}

const lookAndFeel = {
  variant0: 'danger',
  variant1: 'warning',
  variant2: 'info',
  variant3: 'light',
  labels: {
    title: 'Mint Your Item',
    numberUnits: 'How many spins?',
    quantityLabel: 'Tokens'
  }
}

const setup = function (data) {
  let risidioCardMode = 'payment-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const NETWORK = process.env.VUE_APP_NETWORK
  // let beneficiaries = []
  const risidioBaseApi = RISIDIO_API_PATH
  const configuration = {
    lookAndFeel: lookAndFeel,
    gaiaAppDomains: null,
    gaiaAsset: {},
    payment: payment,
    marketConfig: null,
    selling: null,
    minter: minter,
    network: NETWORK,
    risidioProjectId: STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME,
    risidioBaseApi: risidioBaseApi,
    risidioStacksApi: RISIDIO_STACKS_API,
    risidioWalletMac: RISIDIO_WALLET_MAC,
    risidioWalletSky: RISIDIO_WALLET_SKY,
    risidioCardMode: risidioCardMode
  }
  // window.risidioPaymentConfig = JSON.stringify(configuration)
  return configuration
}

export default new Vuex.Store({
  modules: {
    paymentStore
  },
  state: {
    chromeLink: 'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    firefoxLink: 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/',
    webWalletNeeded: false,
    proof: '?proof=0',
    fiatCurrency: 'USD',
    baseCurrency: 'GBP',
    baseAmount: 5,
    windims: { innerWidth: window.innerWidth, innerHeight: window.innerHeight }
  },
  getters: {
    getWebWalletLinkChrome: state => {
      return state.chromeLink
    },
    getWebWalletLinkFirefox: state => {
      return state.firefoxLink
    },
    getRpayConfiguration: state => {
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
    getFiatCurrency: state => {
      return state.fiatCurrency
    },
    getAmounts: state => tickerRates => {
      const baseRate = tickerRates.find((o) => o.currency === state.baseCurrency)
      const fiatRate = tickerRates.find((o) => o.currency === state.fiatCurrency)
      const fiatAmount = (fiatRate.last / baseRate.last) * 5
      const amounts = {
        baseAmounts: getAmounts(state.baseCurrency, state.baseAmount, tickerRates),
        fiatAmounts: getAmounts(state.fiatCurrency, fiatAmount, tickerRates)
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
    initApplication ({ dispatch }) {
      return new Promise((resolve) => {
        dispatch('rpayAuthStore/fetchMyAccount', { root: true }).then((profile) => {
          resolve(profile)
        })
      })
    }
  }
})
