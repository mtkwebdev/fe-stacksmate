import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/store/utils'

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'
const SM_API_PATH = process.env.VUE_APP_RISIDIO_API

const paymentCurrency = function (configuration) {
  if (configuration.payment.paymentOption === 'ethereum') {
    return 'ETH'
  } else if (configuration.payment.paymentOption === 'bitcoin' || configuration.payment.paymentOption === 'lightning') {
    return 'BTC'
  } else {
    return configuration.payment.currency
  }
}
const paymentAmount = function (configuration) {
  if (configuration.payment.paymentOption === 'ethereum') {
    return configuration.payment.amountEth
  } else if (configuration.payment.paymentOption === 'bitcoin' || configuration.payment.paymentOption === 'lightning') {
    return configuration.payment.amountBtc
  } else {
    return configuration.payment.amountFiat
  }
}

const watchTransaction = function (dispatch, commit, recipient, transaction) {
  if (transaction.txStatus === 'pending') {
    dispatch('rpayTransactionStore/watchTransactionInfo', transaction.txId, { root: true }).then((result) => {
      if (result && result.txStatus !== 'pending') {
        result.opcode = 'stx-transaction-update'
        const mergedTx = Object.assign(transaction, result)
        dispatch('paymentStore/updateStacksMateTransaction', result, { root: true }).then(() => {
          commit('addStacksMateUserTransactions', { stxAddress: recipient, transaction: mergedTx })
        }).catch((err) => {
          console.log(err)
        })
      }
    })
  }
}
const watchTransactions = function (dispatch, state, commit, recipient) {
  setInterval(function () {
    const transactions = state.stacksMateTransactions[recipient] || []
    transactions.forEach((transaction) => {
      watchTransaction(dispatch, commit, recipient, transaction)
    })
  }, 15000)
}

/**
const convertSquarePayment = function (rawPayment) {
  const payment = {
    paymentType: 'square',
    amountMoney: {
      amount: rawPayment.amount_money.amount,
      currency: rawPayment.amount_money.currency
    },
    totalMoney: {
      amount: rawPayment.total_money.amount,
      currency: rawPayment.total_money.currency
    },
    createdAt: rawPayment.created_at,
    customerId: rawPayment.customer_id,
    squareId: rawPayment.id,
    locationId: rawPayment.location_id,
    numbCredits: rawPayment.numbCredits,
    orderId: rawPayment.order_id,
    sourceType: rawPayment.source_type,
    receiptNumber: rawPayment.receipt_number,
    receiptUrl: rawPayment.receipt_url,
    updatedAt: rawPayment.updated_at,
    projectId: contractAddress + '.' + contractName
  }
  return payment
}
const convertOpenNodePayment = function (rawPayment) {
  const payment = {
    paymentType: 'opennode',
    amountMoney: {
      amountBtc: rawPayment.amountBtc,
      amountStx: rawPayment.amountStx,
      amount: rawPayment.amountFiat,
      currency: rawPayment.currency
    },
    createdAt: new Date().getTime(),
    numbCredits: rawPayment.numbCredits,
    receiptNumber: rawPayment.txId,
    updatedAt: new Date().getTime(),
    projectId: contractAddress + '.' + contractName
  }
  return payment
}
const convertStxPayment = function (rawPayment) {
  const payment = {
    paymentType: 'stacks',
    amountMoney: {
      amountBtc: rawPayment.amountBtc,
      amountStx: rawPayment.amountStx,
      amount: rawPayment.amountFiat,
      currency: rawPayment.currency
    },
    status: rawPayment.status,
    paymentAddress: rawPayment.paymentAddress,
    sendingAddress: rawPayment.sendingAddress,
    createdAt: new Date().getTime(),
    numbCredits: rawPayment.numbCredits,
    receiptNumber: rawPayment.txId,
    updatedAt: new Date().getTime(),
    projectId: contractAddress + '.' + contractName
  }
  return payment
}
const convertEthPayment = function (rawPayment) {
  const payment = {
    updatedAt: new Date().getTime(),
    projectId: contractAddress + '.' + contractName
  }
  return payment
}
**/

const paymentStore = {
  namespaced: true,
  state: {
    payments: [],
    backers: [],
    stacksMateTransaction: null,
    stacksMateTransactions: {},
    anon: 'anon',
    squareType: 'fiat-payment-success',
    paypalType: 'paypal-payment-success'
  },
  getters: {
    convertToPayment: (state, getters, rootState, rootGetters) => rawPayment => {
      const configuration = rootGetters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      const payment = {
        opcode: rawPayment.opcode,
        txStatus: 'unsent',
        txId: 'unknown',
        nonce: null,
        microstx: utils.toOnChainAmount(configuration.payment.amountStx),
        recipient: rawPayment.recipient,
        stxAddress: process.env.VUE_APP_STACKS_TRANSFER_ADDRESS,
        paymentId: (rawPayment.opcode === state.squareType) ? rawPayment.id : rawPayment.txId,
        paymentAmount: paymentAmount(configuration),
        paymentCurrency: paymentCurrency(configuration),
        paymentCode: rawPayment.opcode,
        paymentStatus: 'paid'
      }
      if (rawPayment.opcode === state.squareType) {
        payment.paymentOrderId = rawPayment.order_id
        payment.paymentUrl = rawPayment.receipt_url
        payment.paymentStatus = rawPayment.status
      }
      return payment
    },
    getLastNonce: state => {
      return state.stacksMateTransaction
    },
    getStacksMateUserTransactions: state => stxAddress => {
      return state.stacksMateTransactions[stxAddress]
    }
  },
  mutations: {
    addBacker (state, backer) {
      if (backer) state.backers.splice(0, 0, backer)
    },
    setStacksMateTransaction (state, stacksMateTransaction) {
      state.stacksMateTransaction = stacksMateTransaction
    },
    setStacksMateUserTransactions (state, data) {
      state.stacksMateTransactions[data.stxAddress] = data.transactions
    },
    addStacksMateUserTransactions (state, data) {
      if (data.stxAddress) {
        const transactions = state.stacksMateTransactions[data.recipient] || []
        transactions.splice(0, 0, data)
      }
    },
    addPayment (state, payment) {
      if (payment) state.payments.splice(0, 0, payment)
    }
  },
  actions: {
    fetchPaymentsForUser ({ commit, rootGetters }) {
      return new Promise(function (resolve, reject) {
        const profile = rootGetters[APP_CONSTANTS.KEY_PROFILE]
        const userKey = (profile.stxAddress) ? 'stxAddress' : 'email'
        const userVal = (profile.stxAddress) ? profile.stxAddress : profile.email
        axios.get(MESH_API_PATH + '/v2/backerByUserKey/' + userKey + '/' + userVal).then((response) => {
          commit('addBacker', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    newPayment ({ commit }, payment) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/payment', payment).then((response) => {
          commit('addPayment', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    fetchStacksMateTransactions ({ dispatch, state, commit }, recipient) {
      return new Promise(function (resolve, reject) {
        axios.get(MESH_API_PATH + '/v2/stacksmate/transactions/' + recipient).then((response) => {
          commit('setStacksMateUserTransactions', { stxAddress: recipient, transactions: response.data })
          resolve(response.data)
          watchTransactions(dispatch, state, commit, recipient)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    fetchLastStacksMateTransaction ({ commit }) {
      return new Promise(function (resolve, reject) {
        axios.get(MESH_API_PATH + '/v2/stacksmate/transaction-recent').then((response) => {
          if (response.data) commit('setStacksMateTransaction', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    deleteStacksMateTransaction ({ commit }, nonce) {
      return new Promise(function (resolve, reject) {
        axios.delete(MESH_API_PATH + '/v2/stacksmate/transactions/' + nonce).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    saveStacksMateTransaction ({ rootGetters }, smTransaction) {
      return new Promise(function (resolve, reject) {
        smTransaction.timeSent = new Date().getTime()
        axios.post(MESH_API_PATH + '/v2/stacksmate/transactions', smTransaction).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    updateStacksMateTransaction ({ commit }, smTransaction) {
      return new Promise(function (resolve, reject) {
        axios.put(MESH_API_PATH + '/v2/stacksmate/transactions', smTransaction).then((response) => {
          commit('setStacksMateTransaction', smTransaction)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch asset: ' + error))
        })
      })
    },
    sendStacksMateTransaction ({ dispatch, commit }, payment) {
      return new Promise(function (resolve, reject) {
        dispatch('saveStacksMateTransaction', payment).then((smTransaction) => {
          commit('setStacksMateTransaction', smTransaction)
          axios.post(SM_API_PATH + '/stacksmate/' + payment.recipient + '/' + payment.nonce + '/' + payment.microstx).then((response) => {
            smTransaction.stxAddress = payment.stxAddress
            smTransaction.nonce = payment.nonce
            smTransaction.txId = response.data
            smTransaction.txStatus = 'pending'
            dispatch('updateStacksMateTransaction', smTransaction)
            dispatch('rpayAuthStore/fetchAccountInfo', { stxAddress: payment.stxAddress }, { root: true })
            commit('addStacksMateUserTransactions', smTransaction)
            resolve(smTransaction)
          }).catch((err) => {
            smTransaction.txStatus = 'failed'
            dispatch('updateStacksMateTransaction', smTransaction)
            dispatch('rpayAuthStore/fetchAccountInfo', { stxAddress: payment.stxAddress }, { root: true })
            if (typeof err === 'object' && err !== null) {
              console.log(Object.keys(err))
              console.log(err.response.data)
              reject(new Error('Unable to fetch asset: ' + err.response.data.message))
            } else {
              console.log('error not object')
              reject(new Error('Unable to fetch asset: ' + err))
            }
          })
        }).catch(() => {
          reject(new Error('Transaction with counter=' + payment.nonce + ' - counter already used'))
        })
      })
    }
  }
}
export default paymentStore
