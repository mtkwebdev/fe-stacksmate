import axios from 'axios'
import {
  UserSession
} from 'blockstack'
// import SockJS from 'sockjs-client'
// import Stomp from '@stomp/stompjs'
import moment from 'moment'
import store from '@/store'

const userSession = new UserSession()
const sessionRootFileName = 'sessions_v01.json'
const configRootFileName = 'config_v01.json'
const numberOfCredits = 2

const API_PATH = process.env.VUE_APP_RADICLE_API
const CONFIG_PROVIDER = process.env.VUE_APP_CONFIG_PROVIDER

const getNewSession = function (now) {
  if (!now) now = moment({}).valueOf()
  return {
    paymentId: null,
    status: 3,
    created: now,
    updated: now,
    testSpin: true,
    clientData: {
      creditsUsed: 0,
      creditsPurchased: numberOfCredits,
      assets: []
    }
  }
}

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    profile: {},
    sessions: []
  }
  newRootFile.sessions.push(getNewSession(now))
  return newRootFile
}

const httpParams = function (httpMethod, btcMethod, postData) {
  const headers = store.getters['authStore/getAuthHeaders']
  return {
    url: API_PATH + btcMethod,
    headers: headers,
    data: postData
  }
}

const contractService = {
  httpParams: function (method, path, data) {
    return httpParams(method, path, data)
  },
  freeSession: {
    freeSessionUsed: false,
    freeSessionInProgress: false
  },
  initSchema: function (loggedIn) {
    return new Promise((resolve) => {
      if (!loggedIn) {
        resolve(getNewRootFile())
        return
      }
      userSession.getFile(sessionRootFileName, { decrypt: true }).then(function (file) {
        if (!file) {
          const rootFile = getNewRootFile()
          userSession.putFile(sessionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
            rootFile.gaiaPath = gaiaPath
            resolve(rootFile)
          })
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        const rootFile = getNewRootFile()
        userSession.putFile(sessionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
          rootFile.gaiaPath = gaiaPath
          resolve(rootFile)
        })
      })
    })
  },
  updateSession: function (rootFile) {
    return new Promise((resolve) => {
      if (!rootFile.sessions) {
        throw new Error('Unexpected root file?')
      }
      userSession.putFile(sessionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
        rootFile.gaiaPath = gaiaPath
        resolve(rootFile)
      })
    })
  },
  newSession: function (rootFile) {
    if (!rootFile.sessions) {
      throw new Error('Unexpected root file?')
    }
    rootFile.sessions.splice(0, 0, getNewSession(undefined))
    return new Promise((resolve) => {
      userSession.putFile(sessionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
        rootFile.gaiaPath = gaiaPath
        resolve(rootFile)
      })
    })
  },

  fetchGlobalConfig: function () {
    return new Promise((resolve) => {
      userSession.getFile(configRootFileName, { username: CONFIG_PROVIDER }).then((file) => {
        resolve(JSON.parse(file))
      }).catch(() => {
        resolve()
      })
    })
  },

  storeGlobalConfig: function (configFile) {
    return new Promise((resolve) => {
      userSession.putFile(configRootFileName, JSON.stringify(configFile), { encrypt: false }).then((gaiaPath) => {
        configFile.gaiaPath = gaiaPath
        resolve(configFile)
      }).catch(() => {
        resolve()
      })
    })
  },

  updateAssets: function (paymentId, assetHash) {
    return new Promise((resolve, reject) => {
      const params = httpParams('put', '/lsat/payment/assets/' + paymentId + '/' + assetHash, null)
      axios.put(params.url, params).then(response => {
        if (response.status === 200) {
          resolve()
        } else {
          reject(new Error('Unable to get new address.'))
        }
      })
        .catch(() => {
          reject(new Error('Service error.'))
        })
    })
  }
}
export default contractService
