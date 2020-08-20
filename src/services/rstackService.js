import {
  UserSession
} from 'blockstack'
import moment from 'moment'

const userSession = new UserSession()
const transactionRootFileName = 'transactions_v01.json'

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    profile: {},
    transactions: []
  }
  return newRootFile
}
var getNewSession = function (txData) {
  const now = moment({}).valueOf()
  return {
    status: 1,
    created: now,
    updated: now,
    txData: txData
  }
}

const rstackService = {
  initSchema: function (loggedIn) {
    return new Promise((resolve) => {
      if (!loggedIn) {
        resolve(getNewRootFile())
        return
      }
      userSession.getFile(transactionRootFileName, { decrypt: true }).then(function (file) {
        if (!file) {
          const rootFile = getNewRootFile()
          userSession.putFile(transactionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
            rootFile.gaiaPath = gaiaPath
            resolve(rootFile)
          })
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        const rootFile = getNewRootFile()
        userSession.putFile(transactionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
          rootFile.gaiaPath = gaiaPath
          resolve(rootFile)
        })
      })
    })
  },
  saveTransaction: function (rootFile, txData) {
    if (!rootFile.transactions) {
      throw new Error('Unexpected root file?')
    }
    rootFile.transactions.splice(0, 0, getNewSession(txData))
    return new Promise((resolve) => {
      userSession.putFile(transactionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
        rootFile.gaiaPath = gaiaPath
        resolve(rootFile)
      })
    })
  },
  updateTransaction: function (rootFile) {
    return new Promise((resolve) => {
      if (!rootFile.transactions) {
        throw new Error('Unexpected root file?')
      }
      userSession.putFile(transactionRootFileName, JSON.stringify(rootFile), { encrypt: true }).then((gaiaPath) => {
        rootFile.gaiaPath = gaiaPath
        resolve(rootFile)
      })
    })
  }
}
export default rstackService
