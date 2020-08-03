import {
  makeContractDeploy,
  makeRandomPrivKey,
  StacksTestnet,
  broadcastTransaction,
  broadcastRawTransaction,
  makeSTXTokenTransfer,
  getAddressFromPrivateKey
  // makeStandardSTXPostCondition,
  // makeContractCall
} from '@blockstack/stacks-transactions'
import BigNum from 'bn.js'
import axios from 'axios'

const network = new StacksTestnet()
const MESH_API = process.env.VUE_APP_MESH_API
const USE_MESH = true

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
    transferFunds ({ commit }, data) {
      return new Promise((resolve, reject) => {
        network.coreApiUrl = 'http://localhost:20443'
        const txOptions = {
          recipient: data.recipient,
          amount: data.amount,
          senderKey: data.senderKey,
          network,
          memo: data.memo,
          // nonce: new BigNum(0), // set a nonce manually if you don't want builder to fetch from a Stacks node
          fee: new BigNum(200) // set a tx fee if you don't want the builder to estimate
        }
        makeSTXTokenTransfer(txOptions).then((transaction) => {
          if (USE_MESH) {
            // const serializedTx = transaction.serialize().toString('hex')
            commit('addContract', data.contractName)
            const txdata = new Uint8Array(transaction.serialize())
            // const blobby = new Blob([txdata])
            // const formData = new FormData()
            // formData.append('filename', 'broadcastRawTransaction')
            // formData.append('bar', blobby, 'filename')
            const headers = {
              'Content-Type': 'application/octet-stream'
            }
            axios.post(MESH_API + '/v2/broadcast', txdata, { headers: headers }).then(response => {
              commit('addResponse', response.data)
              resolve(response)
            }).catch((error) => {
              commit('addResponse', error.response.data)
              resolve(error.response.data)
            })
          } else {
            broadcastTransaction(transaction, network).then((result) => {
              commit('addContract', result)
              resolve(result)
            }).catch((error) => {
              reject(error)
            })
          }
        })
      })
    },
    deployContract ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log('deploying contract: ' + data.contractName)
        network.coreApiUrl = 'http://localhost:20443'
        const txOptions = {
          contractName: data.contractName,
          codeBody: data.codeBody,
          senderKey: data.senderKey,
          fee: new BigNum(3000), // set a tx fee if you don't want the builder to estimate
          network
        }
        makeContractDeploy(txOptions).then((transaction) => {
          broadcastTransaction(transaction, network).then((result) => {
            commit('addContract', data.contractName)
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
          /**
        makeContractDeploy({
          contractName: data.contractName,
          codeBody: data.codeBody,
          fee: new BigNum(data.fee),
          senderKey: data.senderKey, // using same key allows contract-call?
          nonce: new BigNum(data.nonce), // watch for nonce increments if this works - may need to restart mocknet!
          network
        }).then((transaction) => {
          broadcastTransaction(transaction, network).then((result) => {
            commit('addContract', data.contractName)
            resolve(result)
          })
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
          **/
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
