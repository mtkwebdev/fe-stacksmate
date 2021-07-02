import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API
const APPLICATION_ID = process.env.VUE_APP_SQUARE_APPLICATION_ID
const LOCATION_ID = process.env.VUE_APP_SQUARE_LOCATION_ID
const SQUARE_URL = process.env.VUE_APP_VUE_APP_SQUARE_URL
const ETH_PAYMENT_ADDRESS = process.env.VUE_APP_ETH_PAYMENT_ADDRESS
const STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_MINT_FUNCTION = process.env.VUE_APP_STACKS_MINT_FUNCTION
const ETH_CONTRACT_ADDRESS = process.env.VUE_APP_NFT_CONTRACT_ADDRESS
const RISIDIO_WALLET_MAC = process.env.VUE_APP_WALLET_MAC
const RISIDIO_WALLET_SKY = process.env.VUE_APP_WALLET_SKY
const RISIDIO_STACKS_API = process.env.VUE_APP_STACKS_API

const selling = {
}
const marketConfig = {
  oneLayout: true,
  searchMenu: false,
  sideMenu: false
}
const beneficiariesDefault = [
  {
    username: 'donation.id',
    role: 'Charitable Donation',
    email: 'donation@thisisnumberone.com',
    royalty: 10,
    chainAddress: 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
  },
  {
    username: 'environment.id',
    role: 'Environment/Sustainabilty',
    email: 'environment@thisisnumberone.com',
    royalty: 5,
    chainAddress: 'STMYA5EANW6C0HNS1S57VX52M0B795HHFDBW2XBE'
  }
]
const payment = {
  forceNew: false,
  amountFiat: 0.5,
  currency: 'GBP',
  paymentCode: 'po-12324',
  allowMultiples: true,
  stxPaymentAddress: STX_PAYMENT_ADDRESS,
  ethPaymentAddress: ETH_PAYMENT_ADDRESS,
  paymentOption: 'ethereum',
  paymentOptions: [
    { allowFiat: true },
    { allowBitcoin: true },
    { allowLightning: true },
    { allowStacks: true },
    { allowLSAT: false },
    { allowEthereum: true }
  ],
  creditAttributes: {
    start: 4,
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
      network: 'stacks risidio',
      functionName: STX_MINT_FUNCTION,
      enabled: true,
      contractAddress: STX_CONTRACT_ADDRESS,
      contractName: STX_CONTRACT_NAME
    },
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
  enableRoyalties: true,
  beneficiaries: beneficiariesDefault
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

const gaiaAsset = {
  saleData: {}
}

const setup = function (data) {
  if (!data.asset) data.asset = {}
  let risidioCardMode = 'payment-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const NETWORK = process.env.VUE_APP_NETWORK
  // let beneficiaries = []
  const risidioBaseApi = RISIDIO_API_PATH
  const configuration = {
    lookAndFeel: lookAndFeel,
    gaiaAppDomains: ['localhost:8080', 'localhost:8081', 'localhost:8082'],
    gaiaAsset: (data.asset) ? data.asset : gaiaAsset,
    payment: payment,
    marketConfig: marketConfig,
    selling: selling,
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
  },
  state: {
    chromeLink: 'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    firefoxLink: 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/',
    webWalletNeeded: false,
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
    getWebWalletLinkChrome: state => {
      return state.chromeLink
    },
    getWebWalletLinkFirefox: state => {
      return state.firefoxLink
    },
    getRpayConfiguration: state => {
      return state.configuration
    },
    getWebWalletNeeded: state => {
      return state.webWalletNeeded
    },
    getInnerWidth: state => {
      return (state.windims.innerWidth)
    },
    getModalMessage: state => {
      return state.modalMessage
    },
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
    }
  },
  mutations: {
    setRpayFlow (state, data) {
      state.configuration = setup(data)
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
    setStatus (state, status) {
      state.status = status
    },
    setCurrentAccount (state, currentAccount) {
      state.currentAccount = currentAccount
    },
    setFiatCurrency (state, fiatCurrency) {
      state.fiatCurrency = fiatCurrency
    }
  },
  actions: {
    initApplication ({ dispatch }) {
      return new Promise((resolve) => {
        dispatch('rpayAuthStore/fetchMyAccount', { root: true }).then((profile) => {
          resolve(profile)
        })
      })
    }
  }
})
