<template>
<div class="container">
  <div>
    <p>Transfer stax to your;
      <ul>
        <li><a href="#" @click.prevent="useMyWallet()">own account</a></li>
        <li><a href="#" @click.prevent="useTestWallet()">to a test account (switch play mode on))</a></li>
      </ul>
    </p>
    <div>To address: {{recipient}}</div>
    <div class="d-flex justify-content-center">
      <rpay-entry :paymentConfig="configuration" @paymentEvent="paymentEvent"/>
    </div>
  </div>
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
      result: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    paymentEvent: function (event) {
      const paymentData = event.detail[0]
      this.eventData += '<p><pre style="color: #fff;">' + JSON.stringify(paymentData) + '</pre></p>'
      if (paymentData.opcode === 'rpay-payment-confirmed') {
        // this.demoMode = false
      }
    },
    useMyWallet: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'error', title: 'Play Mode', text: 'No network detected - is stax 2.0 blockchain running?!' })
        return
      }
      this.recipient = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
    },
    useTestWallet: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'warn', title: 'Play Mode', text: 'No test wallet selected!' })
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
          orderMsg: 'Place order for \'Satoshi Jokes\' select number required and pay.',
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
          margin: '0',
          border: '0pt solid #232323',
          'border-radius': '0',
          'font-family': '"Arial", sans-serif'
        },
        background: {
          padding: '0px 0 0 0',
          height: 'auto',
          'max-width': '400px',
          position: 'relative',
          top: '0px',
          'background-repeat': 'no-repeat',
          'background-position': 'center center',
          '-webkit-background-size': 'cover',
          '-moz-background-size': 'cover',
          '-o-background-size': 'cover',
          'background-size': 'cover',
          'background-color': '#fff',
          opacity: 0.9
        }
      }
      const productOrder = {
        paymentId: null,
        opcode: 'rpay-place-order',
        purchaseEndpoint: '/assets/buy-now',
        apiKey: 'stax-lightning-exchange',
        lookAndFeel: lookAndFeel,
        paymentOptions: { allowLightning: true, allowEthereum: false, allowBitcoin: false, allowStacks: true },
        paymentOption: 'lightning',
        creditAttributes: {
          amountFiatPerCredit: 0.1,
          fiatCurrency: 'EUR',
          useCredits: true,
          start: 1,
          step: 1,
          min: 1,
          max: 20
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
