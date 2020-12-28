import rstackService from '@/services/rstackService'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import axios from 'axios'

const MESH_API = process.env.VUE_APP_API_RISIDIO + '/mesh'
let socket = null
let stompClient = null

const subscribeApiNews = function (commit) {
  socket = new SockJS(MESH_API + '/api-news')
  stompClient = Stomp.over(socket)
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/stacks-mining-news', function (response) {
      const news = JSON.parse(response.body)
      commit('setMiningNews', news)
    })
    stompClient.subscribe('/queue/rates-news', function (response) {
      const news = JSON.parse(response.body)
      commit('setRatesNews', news)
    })
  },
  function (error) {
    console.log(error)
  })
}

const chartStore = {
  namespaced: true,
  state: {
    initialised: false,
    rootFile: null,
    transaction: null,
    stackingFile: null,
    ratesNews: null,
    miningNews: null,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      legend: {
        display: true
      },
      tooltips: {
        intersect: false
      },
      responsive: true,
      maintainAspectRatio: false
    }
  },
  getters: {
    getChainInfo: (state) => {
      if (!state.miningNews || !state.miningNews.findBlockWinners) return
      let totalBurnFee = 0
      state.miningNews.findBlockWinners.forEach((item) => {
        totalBurnFee += item.burn_fee
      })
      const averageBurn = Math.floor(totalBurnFee / state.miningNews.findBlockWinners.length)
      return {
        averageBurn: averageBurn,
        totalBurnFee: totalBurnFee,
        currentBlockHeight: state.miningNews.findBlockWinners[0].stacks_block_height
      }
    },
    getFees: (state) => {
      if (!state.ratesNews || !state.ratesNews.fees) return
      return state.ratesNews.fees[0]
    },
    getFeePredictions: (state) => {
      if (!state.ratesNews || !state.ratesNews.feePredictions) return
      const filteredData = state.ratesNews.feePredictions // .reverse()
      const chartLabels = filteredData.map(filteredData => filteredData.maxFee)
      return {
        title: 'BTC fees (sat/byte) over past 24 Hrs',
        type: 'bar',
        chartLabels: chartLabels,
        options: state.options,
        datasets: [
          {
            label: 'Confirmed tx at fee / last 24 hours',
            borderColor: '#249EBF',
            backgroundColor: '#249EBF',
            data: filteredData.map(filteredData => filteredData.dayCount)
          },
          {
            label: 'Unconfirmed Tx at Fee',
            borderColor: '#FDA800',
            backgroundColor: '#FDA800',
            data: filteredData.map(filteredData => filteredData.memCount)
          }
        ]
      }
    },
    getBinanceRates: (state) => {
      if (!state.ratesNews || !state.ratesNews.binanceRates) return
      const filteredData = state.ratesNews.binanceRates.reverse()
      const chartData = filteredData.map(filteredData => filteredData.openPrice)
      const chartLabels = filteredData.map(filteredData => filteredData.openTime)
      chartLabels.forEach((element, index) => {
        chartLabels[index] = new Date(element).toLocaleString()
      })
      return {
        title: 'STX / BTC Rates',
        chartLabels: chartLabels,
        options: state.options,
        datasets: [
          {
            label: 'STX to BTC',
            borderColor: '#249EBF',
            borderWidth: 3,
            pointRadius: 1,
            backgroundColor: 'transparent',
            data: chartData
          }
        ]
      }
    },
    findMinerInfo: (state) => {
      if (!state.miningNews || !state.miningNews.findMinerInfo) return
      let filteredData = state.miningNews.findMinerInfo.slice()
      filteredData = filteredData.sort(function compare (a, b) {
        if (a.actual_win > b.actual_win) {
          return 1
        }
        if (a.actual_win < b.actual_win) {
          return -1
        }
        return 0
      })
      const stxADDL = filteredData[0].stx_address.length
      let chartLabels = filteredData.map(filteredData => filteredData.stx_address)
      chartLabels = filteredData.map(filteredData => filteredData.stx_address.substring(0, 5) + '...' + filteredData.stx_address.substring(stxADDL - 6, stxADDL - 1))
      return {
        title: 'STX Address / Actual Win',
        chartLabels: chartLabels,
        options: state.options,
        datasets: [
          {
            label: 'STX Address / Actual Win',
            borderColor: '#249EBF',
            borderWidth: 3,
            pointRadius: 1,
            backgroundColor: '#249EBF',
            data: filteredData.map(filteredData => filteredData.actual_win)
          },
          {
            label: 'STX Address / Total Win',
            borderColor: '#FDA800',
            borderWidth: 0,
            pointRadius: 0,
            backgroundColor: '#FDA800',
            data: filteredData.map(filteredData => filteredData.total_win)
          /**
          },
          {
            label: 'STX Address / Win Ratio',
            borderColor: '#00695c',
            borderWidth: 0,
            pointRadius: 1,
            backgroundColor: 'transparent',
            data: filteredData.map(filteredData => ((filteredData.total_win - filteredData.actual_win)))
            **/
          }
        ]
      }
    },
    groupByBurnFee: (state) => {
      if (!state.miningNews || !state.miningNews.findMinerInfo) return
      let filteredData = state.miningNews.findMinerInfo.slice()
      filteredData = filteredData.sort(function compare (a, b) {
        const a1 = (a.total_mined > 0) ? a.miner_burned / a.total_mined : 0
        const b1 = (b.total_mined > 0) ? b.miner_burned / b.total_mined : 0
        if (a1 > b1) {
          return 1
        } else if (a1 < b1) {
          return -1
        } else {
          return 0
        }
      })
      const stxADDL = filteredData[0].stx_address.length
      let chartLabels = filteredData.map(filteredData => filteredData.stx_address)
      chartLabels = filteredData.map(filteredData => filteredData.stx_address.substring(0, 5) + '...' + filteredData.stx_address.substring(stxADDL - 6, stxADDL - 1))
      return {
        title: 'STX Address / Actual Win',
        chartLabels: chartLabels,
        options: state.options,
        datasets: [
          {
            label: 'Burned Per Block Mined',
            borderColor: '#249EBF',
            borderWidth: 0,
            pointRadius: 1,
            backgroundColor: '#249EBF',
            data: filteredData.map(filteredData => Math.floor((filteredData.miner_burned / filteredData.total_mined)))
          }
        ]
      }
    },
    groupByActualWinPerBlock: (state) => {
      if (!state.miningNews || !state.miningNews.findMinerInfo) return
      let filteredData = state.miningNews.findMinerInfo.slice()
      filteredData = filteredData.sort(function compare (a, b) {
        const a1 = a.actual_win / a.total_mined
        const b1 = b.actual_win / b.total_mined
        if (a1 > b1) {
          return 1
        } else if (a1 < b1) {
          return -1
        } else {
          return 0
        }
      })
      const stxADDL = filteredData[0].stx_address.length
      let chartLabels = filteredData.map(filteredData => filteredData.stx_address)
      chartLabels = filteredData.map(filteredData => filteredData.stx_address.substring(0, 5) + '...' + filteredData.stx_address.substring(stxADDL - 6, stxADDL - 1))
      return {
        title: 'Average Actual Wins Per Block',
        chartLabels: chartLabels,
        options: state.options,
        datasets: [
          {
            label: 'Actual Win Per Block Mined',
            borderColor: '#FDA800',
            borderWidth: 0,
            pointRadius: 0,
            backgroundColor: '#FDA800',
            data: filteredData.map(filteredData => (filteredData.actual_win / filteredData.total_mined))
          }
        ]
      }
    },
    getTickerRates: (state) => {
      return state.ratesNews.tickerRates
    },
    findBlockWinners: (state) => {
      return state.miningNews.findBlockWinners
    },
    groupByDistribution: (state) => {
      return state.miningNews.groupByDistribution
    },
    groupByWinners: (state) => {
      return state.miningNews.groupByWinners
    }
  },
  mutations: {
    initialised (state) {
      state.initialised = true
    },
    rootFile (state, rootFile) {
      state.rootFile = rootFile
    },
    setCurrentTransaction (state, transaction) {
      state.transaction = transaction
    },
    setStackingFile (state, stackingFile) {
      state.stackingFile = stackingFile
    },
    setRatesNews (state, ratesNews) {
      state.ratesNews = ratesNews
    },
    setMiningNews (state, miningNews) {
      state.miningNews = miningNews
    }
  },
  actions: {
    readApiData ({ commit }) {
      return new Promise(() => {
        subscribeApiNews(commit)
        axios.get(MESH_API + '/v1/rates-news').then(response => {
          commit('setRatesNews', response.data)
        }).catch((error) => {
          console.log(error)
        })
        axios.get(MESH_API + '/v1/stacks-mining-news').then(response => {
          commit('setMiningNews', response.data)
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    saveBtcAddress ({ state, commit }, btcAddress) {
      return new Promise((resolve, reject) => {
        state.stackingFile.btcAddress = btcAddress
        rstackService.checkBitcoinAddress(btcAddress).then((result) => {
          if (!result) {
            reject(new Error('Bitcoin address not valid'))
          } else {
            rstackService.saveStackingFile(state.stackingFile).then((stackingFile) => {
              commit('stackingFile', stackingFile)
              resolve(stackingFile)
            })
          }
        })
      })
    },
    saveToGaia ({ state, commit }, txData) {
      return new Promise((resolve) => {
        const item = state.rootFile.transactions.find(item => item.txData.result === txData.result)
        if (item) {
          resolve(item)
          return
        }
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile.transactions[0])
        })
      })
    },
    saveMacaroon ({ state, commit }, txData) {
      return new Promise((resolve) => {
        const item = state.rootFile.transactions.find(item => item.txData.preimage === txData.preimage)
        if (item) {
          resolve(item)
          return
        }
        rstackService.saveTransaction(state.rootFile, txData).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(rootFile.transactions[0])
        })
      })
    }
  }
}
export default chartStore
