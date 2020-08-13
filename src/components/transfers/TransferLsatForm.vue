<template>
<div class="">
  <div class="d-flex justify-content-between" v-if="wallet">
    <div class="col-2">
      <p>Account</p>
      <p>Balance</p>
    </div>
    <div class="col-10">
      <p>{{wallet.keyInfo.address}}</p>
      <p>{{wallet.balance}}</p>
    </div>
  </div>
  <div class="d-flex justify-content-start" v-else>
    <div class="mx-5">
      <p>Log in to use your stacks address or select 'play mode' to generate a test wallet.
      </p>
    </div>
  </div>
  <div class="">
    <p>Note: On testnet we set our rate to 0.1% of Binance 24hr average.
      - equivalent to sending us a tip over the lightning network.
    </p>
  </div>
  <div class="d-flex justify-content-center" v-if="configuration">
    <rpay-entry :paymentConfig="configuration" @paymentEvent="paymentEvent"/>
  </div>
  <b-modal scrollable id="modal-1" title="LSAT Events">
    <div class="row" v-if="paymentData">
      <div class="col-12 my-1">
        <div>Payment Received</div>
        <div>For {{paymentData.numbCredits}} STX Tokens</div>
        <div>Transfer to STX Address {{addressTrunc}} begun</div>
        <div v-if="loggedIn">Saving proof of payment (LSAT Macaroon) to your Gaia storage</div>
        <div v-else>Login to save proof of payment (LSAT Macaroon) to your Gaia storage</div>
      </div>
    </div>
    <template v-slot:modal-footer>
    </template>
  </b-modal>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'TransferLsatForm',
  components: {
  },
  props: ['lookAndFeel'],
  data () {
    return {
      loading: true,
      amountMicroStax: null,
      recipient: null,
      memo: '',
      result: null,
      paymentData: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    paymentEvent: function (event) {
      this.paymentData = event.detail[0]
      if (this.paymentData.opcode === 'lsat-payment-confirmed') {
        this.$bvModal.show('modal-1')
        this.$store.dispatch('saveMacaroon')
        this.$store.dispatch('transferStax')
      }
    },
    useMyWallet: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'error', title: 'Error Detected', text: 'No network detected - is Stacks 2.0 blockchain running?' })
        return
      }
      this.recipient = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
    },
    useTestWallet: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'warn', title: 'Error Detected', text: 'No test wallet selected!' })
        return
      }
      this.recipient = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
    },
    makeTransfer: function () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (provider === 'risidio' && !sender) {
        this.result = 'Please select a test wallet to use with risidio provider.'
        return
      }
      const data = {
        recipient: this.recipient,
        senderKey: (sender) ? sender.keyInfo.privateKey : null,
        amount: this.amountMicroStax,
        memo: this.memo
      }
      if (provider === 'blockstack') {
        this.$store.dispatch('authStore/makeTransferBlockstack', data).then((result) => {
          this.result = result
        }).catch((error) => {
          this.result = error
        })
      } else {
        this.$store.dispatch('authStore/makeTransferRisidio', data).then((result) => {
          this.result = result
        }).catch((error) => {
          this.result = error
        })
      }
    }
    /**
    sendEvent: function () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return
      }
      const data = {
        recipient: this.recipient,
        senderKey: sender.keyInfo.privateKey,
        amount: new BigNum(this.amountMicroStax),
        memo: this.memo
      }
      this.$store.dispatch('transactionStore/transferFunds', data).then((txid) => {
        if (txid.error) {
          this.result = 'Transaction failed: error=' + txid.error + ' ' + txid.reason
        } else {
          this.result = 'Transaction success: txid=' + txid
        }
      }).catch((error) => {
        this.result = 'Transaction failed: error=' + error
      })
    }
    **/
  },
  computed: {
    wallet () {
      let wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      if (!wallet) {
        wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      }
      return wallet
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.loggedIn
    },
    testWallet () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      return wallet
    },
    amountTrunc () {
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      // const tunced = Math.round(exchangeRate.amountStx * 10000)
      return (1 / (exchangeRate.amountStx)).toFixed(4)
    },
    truncMe: function (address) {
      address = address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length)
      return address
    },
    addressTrunc () {
      let wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      if (!wallet) {
        wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      }
      if (!wallet || !wallet.keyInfo) {
        return ''
      }
      let address = wallet.keyInfo.address
      address = address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length)
      return address
    },
    amountStax () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return
      }
      return Math.floor(sender.balance / 1000)
    },
    configuration () {
      // const content = this.$store.getters['contentStore/getProductPage']('lsat')
      // const height = this.$store.getters[SITE_CONSTANTS.KEY_SECTION_HEIGHT]
      const lookAndFeel = {
        labels: {
          orderMsg: 'Send us a tip on lightning in exchange for some testnet \'STX Tokens\'.',
          successMsg: 'Your STX order for has been received with thanks.',
          title: 'R-Pay',
          subtitle: 'Stacks Lightning Exchange',
          card1Label: 'Select payment option',
          card2Label1: 'Number of tokens required?',
          card2Label2: 'Select operation',
          card2Label3: 'Make Payment',
          card2Label4: 'Open Channel',
          button1Label: 'Back',
          button2Label: 'Next',
          quantityLabel: 'Token(s)'
        },
        sections: {
          stepper: true
        },
        cardStyle: {
        },
        text1Color: {
          color: '#fff'
        },
        text2Color: {
          color: '#FFCE00'
        },
        text3Color: {
          color: '#000'
        },
        background: {
          padding: '0px 0 0 0',
          height: 'auto',
          'max-width': '400px',
          position: 'relative',
          'border-radius': '15px',
          top: '0px',
          'background-repeat': 'no-repeat',
          'background-position': 'top left',
          '-webkit-background-size': 'cover',
          '-moz-background-size': 'cover',
          '-o-background-size': 'cover',
          'background-size': 'cover',
          'background-color': '#000',
          'background-image': 'url("https://images.prismic.io/risidio-journal/59455bcb-a954-4713-9afd-cfe6130f0b26_Group+994.svg?auto=compress,format")',
          opacity: 0.9
        }
      }
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      if (!exchangeRate) {
        return
      }
      const testnetRate = exchangeRate.amountStx / 10000
      const productOrder = {
        paymentId: null,
        opcode: 'rpay-place-order',
        purchaseEndpoint: '/assets/buy-now',
        serviceKey: 'stax-lightning-exchange',
        serviceStatus: -1,
        apiKey: 'mesh-1',
        lookAndFeel: lookAndFeel,
        paymentOptions: { allowLightning: true, allowEthereum: false, allowBitcoin: false, allowStacks: false },
        paymentOption: 'lightning',
        creditAttributes: {
          // amountFiatFixed: 0.20,
          amountFiatPerCredit: testnetRate,
          fiatCurrency: 'EUR',
          useCredits: true,
          start: 500,
          step: 100,
          min: 100,
          max: 2000
        }
      }
      const po = JSON.stringify(productOrder)
      window.risidioPaymentConfig = po
      return po
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  text-transform: uppercase;
}
</style>
