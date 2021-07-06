import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'
const contractAddress = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const contractName = process.env.VUE_APP_STACKS_CONTRACT_NAME

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

const paymentStore = {
  namespaced: true,
  state: {
    payments: [],
    backers: [],
    anon: 'anon',
    squareType: 'fiat-payment-success',
    paypalType: 'paypal-payment-success'
  },
  getters: {
    convertToPayment: state => rawPayment => {
      if (rawPayment.opcode === state.squareType || rawPayment.opcode === state.paypalType) {
        return convertSquarePayment(rawPayment)
      } else if (rawPayment.opcode === 'stx-crypto-payment-success') {
        return convertStxPayment(rawPayment)
      }
      return convertOpenNodePayment(rawPayment)
    }
  },
  mutations: {
    addBacker (state, backer) {
      if (backer) state.backers.splice(0, 0, backer)
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
    }
  }
}
export default paymentStore
