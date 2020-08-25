import {
  UserSession
} from 'blockstack'
import moment from 'moment'
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
var WAValidator = require('wallet-address-validator')

const userSession = new UserSession()
const transactionRootFileName = 'transactions_v01.json'
const stackingFileName = 'stacking_v01.json'
// const _API = process.env.VUE_APP_API_RISIDIO

function isBTCAddress (address) {
  if (!/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) return false
  const bufferLength = 25
  const buffer = new Uint8Array(bufferLength)
  const digits58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  for (var i = 0; i < address.length; i++) {
    const num = digits58.indexOf(address[i])
    // buffer = buffer * 58 + num
    let carry = 0
    for (var j = bufferLength - 1; j >= 0; --j) {
      // num < 256, so we just add it to last
      const result = buffer[j] * 58 + carry + (j === bufferLength - 1 ? num : 0)
      buffer[j] = result % (1 << 8)
      carry = Math.floor(result / (1 << 8))
    }
  }
  // check whether sha256(sha256(buffer[:-4]))[:4] === buffer[-4:]
  const hashedWords1 = sha256(CryptoJS.lib.WordArray.create(buffer.slice(0, 21)))
  const hashedWords = sha256(hashedWords1).words
  // get buffer[-4:] with big-endian
  const lastWordAddress = new DataView(buffer.slice(-4).buffer).getInt32(0, false)
  const expectedLastWord = hashedWords[0]
  return lastWordAddress === expectedLastWord
}

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
var getStackingFile = function () {
  const now = moment({}).valueOf()
  return {
    status: 1,
    created: now,
    updated: now,
    btcAddress: null,
    stacking: false,
    rewardCycles: []
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

  initStacking: function (loggedIn) {
    return new Promise((resolve) => {
      const stackingFile = getStackingFile()
      if (!loggedIn) {
        resolve(stackingFile)
        return
      }
      userSession.getFile(stackingFileName, { decrypt: true }).then(function (file) {
        if (!file) {
          userSession.putFile(stackingFileName, JSON.stringify(stackingFile), { encrypt: true }).then((gaiaPath) => {
            stackingFile.gaiaPath = gaiaPath
            resolve(stackingFile)
          })
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        userSession.putFile(stackingFileName, JSON.stringify(getStackingFile()), { encrypt: true })
      })
    })
  },

  saveStackingFile: function (stackingFile) {
    if (!stackingFile) {
      throw new Error('Unexpected root stacking data?')
    }
    return new Promise((resolve) => {
      userSession.putFile(stackingFileName, JSON.stringify(stackingFile), { encrypt: true }).then((gaiaPath) => {
        stackingFile.gaiaPath = gaiaPath
        resolve(stackingFile)
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

  checkBitcoinAddress (btcAddress) {
    return new Promise((resolve) => {
      if (btcAddress) {
        resolve(WAValidator.validate(btcAddress, 'BTC', 'mainnet'))
      } else {
        resolve(isBTCAddress(btcAddress))
      }
      /**
      const url = _API + '/lsat/checkaddress'
      axios.post(url, { address: btcAddress }).then(response => {
        resolve(response.data.details.result)
      })
        .catch(e => {
          reject(new Error({ error: 'Unable to get new address.' }))
        })
    **/
    })
  }
}
export default rstackService
