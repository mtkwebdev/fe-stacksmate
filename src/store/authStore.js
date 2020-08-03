/* eslint-disable */
import {
  Person,
  UserSession
} from 'blockstack'
import { openContractDeploy, showBlockstackConnect, authenticate } from '@blockstack/connect'
import router from '@/router'
import store from '@/store'
import lsatHelper from 'lsat-entry.js'
import {
  makeContractDeploy,
  // makeRandomPrivKey,
  // StacksTestnet,
  // broadcastTransaction,
  // broadcastRawTransaction,
  // makeSTXTokenTransfer,
  // getAddressFromPrivateKey
  // makeStandardSTXPostCondition,
  // makeContractCall
} from '@blockstack/stacks-transactions'

const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)

const userSession = new UserSession()

const origin = window.location.origin
const authFinished = function() {
  store.dispatch('initApplication').then(() => {
    router.push('/')
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
          resolve(profile)
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const profile = getProfile()
            commit('myProfile', profile)
            commit('authHeaders', authHeaders())
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
    deployContractBlockstack ({ commit }, data) {
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
    }
  }
}
export default authStore
