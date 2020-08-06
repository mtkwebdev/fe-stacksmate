import {
  makeRandomPrivKey,
  StacksTestnet,
  broadcastRawTransaction,
  getAddressFromPrivateKey
} from '@blockstack/stacks-transactions'
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
        // const stacksPublicKey = createStacksPublicKey(privateKey.data.toString('hex'))
        const account = {
          value: publicKey,
          text: null,
          balance: 0,
          sk: privateKey.data.toString('hex')
        }

        resolve(account)
      })
    }
  }
}
export default transactionStore
