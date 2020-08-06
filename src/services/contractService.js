import {
  UserSession
} from 'blockstack'
import moment from 'moment'
import store from '@/store'

const userSession = new UserSession()
const sessionRootFileName = 'contracts_v01.json'
const configRootFileName = 'config_v01.json'

const API_PATH = process.env.VUE_APP_RADICLE_API
const CONFIG_PROVIDER = process.env.VUE_APP_CONFIG_PROVIDER

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    profile: {},
    contracts: []
  }
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
      if (!rootFile.contracts) {
        throw new Error('Unexpected root file?')
      }
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
  }
}
export default contractService
