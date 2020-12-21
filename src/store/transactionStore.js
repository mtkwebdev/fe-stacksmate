import {
  makeRandomPrivKey,
  broadcastRawTransaction,
  getAddressFromPrivateKey
} from '@stacks/transactions'
import {
  StacksTestnet
} from '@stacks/network'
const network = new StacksTestnet()
const transactionStore = {
  namespaced: true,
  state: {
    contractName: null
  },
  getters: {
  },
  mutations: {
    addContract: (state, contractName) => {
      state.contractName = contractName
    }
  },
  actions: {
    sendTx ({ commit }, transaction) {
      return new Promise((resolve) => {
        network.coreApiUrl = 'http://localhost:20443'
        broadcastRawTransaction(transaction.serialize(), network.coreApiUrl).then(() => {
          resolve({ transaction: transaction })
        })
      })
    },
    makeKey () {
      return new Promise((resolve) => {
        const privateKey = makeRandomPrivKey()
        const publicKey = getAddressFromPrivateKey(privateKey.data.toString('hex'))
        const wallet = {
          keyInfo: {
            address: publicKey,
            privateKey: privateKey.data.toString('hex')
          },
          balance: 0
        }
        resolve(wallet)
      })
    }
  }
}
export default transactionStore
