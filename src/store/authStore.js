/* eslint-disable */
import { UserSession } from '@stacks/auth'
import { showConnect, authenticate } from '@stacks/connect'
import router from '@/router'
import store from '@/store/staxStore'
import {
  getAddressFromPrivateKey,
  createStacksPrivateKey
} from '@stacks/transactions'
import axios from 'axios'

const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)
const MESH_API = process.env.VUE_APP_API_RISIDIO + '/mesh'
const userSession = new UserSession()

const origin = window.location.origin

const getStacksAccount = function (appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey)
  return getAddressFromPrivateKey(privateKey.data.toString('hex'))
}
const authFinished = function() {
  store.dispatch('initApplication').then((resp) => {
    console.log(resp)
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
const getUserWallet = function (dispatch) {
  if (userSession.isUserSignedIn()) {
    const account = userSession.loadUserData()
    const publicKey = getStacksAccount(account.appPrivateKey)
    // const publicKey = getAddressFromPrivateKey(id.privateKey.data.toString('hex'))
    const userAddress = (NETWORK === 'mainnet') ? account.profile.stxAddress.mainnet : account.profile.stxAddress.testnet
    // account.profile.stxAddress
    // addressToString(id.address)
    dispatch('fetchWalletInfo', userAddress).then((response) => {
      const wallet = {
        keyInfo: {
          address: (NETWORK === 'mainnet') ? account.profile.stxAddress.mainnet : account.profile.stxAddress.testnet
        },
        balance: response.data.balance, // parseInt(response.data.balance, 16),
        nonce: response.data.nonce,
        label: account.username
      }
      store.commit('authStore/userWallet', wallet)
    }).catch((err) => {
      console.log(err)
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
      let name = account.profile.name
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
      const avatarUrl = account.profile.avatarUrl
      // let privateKey = account.appPrivateKey + '01'
      // privateKey = hexStringToECPair(privateKey).toWIF()
      // const authResponseToken = account.authResponseToken
      // var decodedToken = decodeToken(authResponseToken)
      const loggedIn = true
      myProfile = {
        loggedIn: loggedIn,
        stxAddress: account.profile.stxAddress,
        senderKey: account.privateKey,
        showAdmin: showAdmin,
        superAdmin: uname === 'mijoco.id.blockstack',
        name: name,
        description: account.profile.description,
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
    userWallet: null,
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    },
    appName: 'Risidio Mesh',
    appLogo: '/img/logo/Risidio_logo_256x256.png',
    authHeaders: null,
    networkId: 'testnet',
    provider: 'risidio'
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
    fetchMyAccount ({ commit, dispatch }) {
      return new Promise(resolve => {
        if (userSession.isUserSignedIn()) {
          // userSession.signUserOut(window.location.origin)
          const profile = getProfile()
          commit('myProfile', profile)
          commit('authHeaders', authHeaders())
          // getUserWallet(dispatch)
          resolve(profile)
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const profile = getProfile()
            commit('myProfile', profile)
            commit('authHeaders', authHeaders())
            // getUserWallet(dispatch)
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
          showConnect(authOptions)
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
    fetchShakerData ({ state, commit }) {
      return new Promise((resolve) => {
        if (!state.myProfile.loggedIn || !state.myProfile.superAdmin) {
          resolve()
          return
        }
        const provider = store.getters['authStore/getProvider']
        const useApi = (provider === 'risidio') ? MESH_API_RISIDIO : MESH_API
        axios.post(useApi + '/v1/shaker', null, { headers: authHeaders() }).then(response => {
          const shakerData = response.data
          resolve(shakerData)
        }).catch(() => {
          resolve()
        })
      })
    }
  }
}
export default authStore
