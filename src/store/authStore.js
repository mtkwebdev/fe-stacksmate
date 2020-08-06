/* eslint-disable */
import {
  Person,
  UserSession
} from 'blockstack'
import { openSTXTransfer, openContractDeploy, showBlockstackConnect, authenticate } from '@blockstack/connect'
import router from '@/router'
import store from '@/store'
import {
  addressToString,
  makeContractDeploy,
  makeSTXTokenTransfer,
  StacksTestnet,
  createStacksPrivateKey,
  getPublicKey,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode
} from '@blockstack/stacks-transactions'
import BigNum from 'bn.js'
import axios from 'axios'

const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)
const network = new StacksTestnet()
const MESH_API = process.env.VUE_APP_MESH_API
const userSession = new UserSession()

const origin = window.location.origin

const getStacksAccount = function (appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey)
  const publicKey = getPublicKey(privateKey)
  const address = addressFromPublicKeys(
    AddressVersion.TestnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  )
  return { privateKey, address }
}
const authFinished = function() {
  store.dispatch('initApplication').then(() => {
    if (window.location.pathname !== '/') {
      router.push('/')
    }
  })
}
const authOptions = {
  sendToSignIn: false,
  redirectTo: '/',
  manifestPath: '/manifest.json',
  finished: authFinished,
  // authOrigin: 'http://localhost:8080',
  // userSession: userSession,
  appDetails: {
    name: 'Risidio Meshnet',
    icon: origin + '/img/logo/risidio_black.svg'
  }
}
const getUserWallet = function () {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData()
    const appPrivateKey = userData.appPrivateKey
    const id = getStacksAccount(appPrivateKey)
    const userAddress = addressToString(id.address)
    store.dispatch('fetchWalletInfo', userAddress).then((response) => {
      const wallet = {
        keyInfo: {
          address: response.data.address
        },
        balance: parseInt(response.data.balance, 16)
      }
      store.commit('authStore/userWallet', wallet)
    })
  }
  return ''
}
const getProfile = function () {
  let myProfile = {
    loggedIn: false
  }
  try {
    const account = userSession.loadUserData()
    if (account) {
      let uname = account.username
      const person = new Person(account.profile)
      let name = person.name()
      if (uname) {
        if (!name) {
          const indexOfDot = uname.indexOf('.')
          name = uname.substring(0, indexOfDot)
        }
      }
      if (!uname && name) {
        uname = name
      }
      if (!uname) {
        uname = ''
      }
      const showAdmin =
        uname === 'mike.personal.id' ||
        uname.indexOf('brightblock') > -1 ||
        uname.indexOf('risidio') > -1 ||
        uname.indexOf('radicle') > -1 ||
        uname.indexOf('mijoco') > -1 ||
        uname.indexOf('head') > -1 ||
        uname.indexOf('testuser0934583') > -1 ||
        uname.indexOf('feek') > -1
      const avatarUrl = person.avatarUrl()
      // let privateKey = account.appPrivateKey + '01'
      // privateKey = hexStringToECPair(privateKey).toWIF()
      // const authResponseToken = account.authResponseToken
      // var decodedToken = decodeToken(authResponseToken)
      const loggedIn = true
      myProfile = {
        loggedIn: loggedIn,
        showAdmin: showAdmin,
        showSuperAdmin: uname === 'mijoco.id.blockstack',
        name: name,
        description: person.description(),
        avatarUrl: avatarUrl,
        username: uname,
        hubUrl: account.hubUrl,
        apps: account.profile.apps
      }
    }
    return myProfile
  } catch (err) {
    return myProfile
  }
}

const authHeaders = function () {
  let publicKey
  let token = 'v1:no-token' // note: not all requests require auth token - e.g. getPaymentAddress
  if (userSession.isUserSignedIn()) {
    const account = userSession.loadUserData()
    if (account) {
      // authResponseToken = account.authResponseToken
      // decodedToken = decodeToken(authResponseToken)
      // publicKey = decodedToken.payload.public_keys[0]
      token = 'v1:' + account.authResponseToken
    }
  }
  const headers = {
    IdentityAddress: publicKey,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  return headers
}

const authStore = {
  namespaced: true,
  state: {
    userWallet: '',
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    },
    appName: 'Risidio Mesh',
    appLogo: '/img/logo/Risidio_logo_256x256.png',
    authHeaders: null,
    networkId: 'testnet',
    provider: 'blockstack'
  },
  getters: {
    getMyProfile: state => {
      if (!state.myProfile) {
        return {
          loggedIn: false
        }
      }
      return state.myProfile
    },
    getUserWallet: (state) => {
      return state.userWallet
    },
    getProvider: (state) => {
      return state.provider
    },
    getNetworkId: (state) => {
      return state.networkId
    },
    getAuthHeaders: (state) => {
      return state.authHeaders
    }
  },
  mutations: {
    loggedIn (state, loggedIn) {
      state.myProfile.loggedIn = loggedIn
    },
    setProvider (state, provider) {
      state.provider = provider
    },
    setNetworkId (state, networkId) {
      state.networkId = networkId
    },
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    },
    userWallet (state, userWallet) {
      state.userWallet = userWallet
    },
    authHeaders (state, authHeaders) {
      state.authHeaders = authHeaders
    }
  },
  actions: {
    fetchMyAccount ({ commit }) {
      return new Promise(resolve => {
        if (userSession.isUserSignedIn()) {
          // userSession.signUserOut(window.location.origin)
          const profile = getProfile()
          commit('myProfile', profile)
          commit('authHeaders', authHeaders())
          getUserWallet()
          resolve(profile)
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const profile = getProfile()
            commit('myProfile', profile)
            commit('authHeaders', authHeaders())
            getUserWallet()
            resolve(profile)
          })
        } else {
          const profile = getProfile()
          commit('myProfile', profile)
          commit('authHeaders', authHeaders())
          resolve(profile)
        }
      })
    },
    startLogin({ }) {
      return new Promise(resolve => {
        if (BLOCKSTACK_LOGIN === 1) {
          showBlockstackConnect(authOptions)
        } else if (BLOCKSTACK_LOGIN === 2) {
          authenticate(authOptions)
        } else {
          const origin = window.location.origin
          const transitKey = userSession.generateAndStoreTransitKey()
          const scopes = [
            'store_write',
            'publish_data'
          ]
          const authRequest = userSession.makeAuthRequest(transitKey, origin, origin + '/manifest.json', scopes)
          userSession.redirectToSignInWithAuthRequest(authRequest, 'http://localhost:8888/auth')
          resolve()
        }
      })
    },
    startLogout ({ commit }) {
      return new Promise(() => {
        if (userSession.isUserSignedIn()) {
          userSession.signUserOut(window.location.origin)
          commit('myProfile', getProfile())
        }
      })
    },
    deployContractBlockstack ({ state }, data) {
      return new Promise(() => {
        const authOrigin = (state.provider === 'local-network') ? 'http://localhost:20443' : null
        openContractDeploy({
          contractName: data.contractName,
          codeBody: data.codeBody,
          authOrigin,
          appDetails: {
            name: state.appName,
            icon: state.appLogo
          },
          finished: (trans) => {
            console.log(trans.txId)
            store.dispatch('contractStore/saveContract', data)
          }
        })
      })
    },
    deployContractRisidio ({ commit }, data) {
      return new Promise((resolve, reject) => {
        network.coreApiUrl = 'http://localhost:20443'
        const txOptions = {
          contractName: data.contractName,
          codeBody: data.codeBody,
          senderKey: data.senderKey,
          // nonce: new BigNum(data.nonce), // watch for nonce increments if this works - may need to restart mocknet!
          fee: new BigNum(3000), // set a tx fee if you don't want the builder to estimate
          network
        }
        makeContractDeploy(txOptions).then((transaction) => {
          commit('addContract', data.contractName)
          const array = new Uint8Array(transaction.serialize())
          const blobby = new Blob([array])
          const formData = new FormData()
          formData.append('filename', 'broadcastRawTransaction')
          formData.append('bar', blobby, 'filename')
          const headers = {
            'Content-Type': 'multipart/form-data;'
          }
          axios.post(MESH_API + '/v2/deploy', formData, { headers: headers }).then(response => {
            commit('addResponse', response.data)
            resolve(response)
          }).catch((error) => {
            commit('addResponse', error.response.data)
            resolve(error.response.data)
          })
        })
      })
    },
    makeTransferBlockstack ({ state }, data) {
      return new Promise(() => {
        const authOrigin = (state.provider === 'local-network') ? 'http://localhost:20443' : null
        openSTXTransfer({
          recipient: data.recipient,
          amount: data.amount,
          memo: data.memo,
          authOrigin,
          appDetails: {
            name: state.appName,
            icon: state.appLogo
          },
          finished: data => {
            console.log(data.txId);
          },
        })
      })
    },
    makeTransferRisidio ({ commit }, data) {
      return new Promise((resolve, reject) => {
        network.coreApiUrl = 'http://localhost:20443'
        let amount = new BigNum(data.amount)
        amount = amount.div(new BigNum(1000000))
        const txOptions = {
          recipient: data.recipient,
          amount: amount,
          senderKey: data.senderKey,
          network,
          memo: data.memo,
          // nonce: new BigNum(0), // set a nonce manually if you don't want builder to fetch from a Stacks node
          fee: new BigNum(200) // set a tx fee if you don't want the builder to estimate
        }
        makeSTXTokenTransfer(txOptions).then((transaction) => {
          commit('addContract', data.contractName)
          const txdata = new Uint8Array(transaction.serialize())
          const headers = {
            'Content-Type': 'application/octet-stream'
          }
          axios.post(MESH_API + '/v2/broadcast', txdata, { headers: headers }).then(response => {
            commit('addResponse', response.data)
            resolve(response)
          }).catch((error) => {
            commit('addResponse', error.response.data)
            resolve(error.response.data)
          })
        })
      })
    }
  }
}
export default authStore
