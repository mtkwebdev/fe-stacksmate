<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <wallets />
    </div>
  </div>
  <div>
    <h4>Transfer Stax Form</h4>
    <b-form>
      <label class="mb-2 sr-only" for="inline-form-input-name">Transfers</label>
      <b-input
        ref="recipient"
        v-model="recipient"
        class="mt-3"
        placeholder="Recipient Stax Address"></b-input>
      <b-input
        ref="amount"
        :value="amountStax"
        class="mt-3"
        placeholder="Amount of Stax to send"></b-input>
      <b-input
        ref="memo"
        class="mt-3"
        maxlength=34
        v-model="memo"
        placeholder="Notes..."></b-input>
      <b-form-text v-if="memo">
        {{memo.length}} / 34
      </b-form-text>
      <b-button v-if="amountStax > 0 && recipient" class="mt-3 btn-sm bg-info" @click="sendEvent()">Transfer</b-button>
    </b-form>
    <div class="container m-5">
      {{result}}
    </div>
    <div class="d-flex justify-content-center mt-5 mb-4">
      <div>
        <lsat-entry :paymentConfig="configuration" @paymentEvent="paymentEvent"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import BigNum from 'bn.js'
import Wallets from '@/components/Wallets'

export default {
  name: 'TransferStax',
  components: {
    Wallets
  },
  props: ['lookAndFeel'],
  data () {
    return {
      loading: true,
      sender: null,
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
      if (paymentData.opcode === 'lsat-payment-confirmed') {
        // this.demoMode = false
      }
    },
    sendEvent: function () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_CURRENT_ACCOUNT]
      if (!sender || !sender.balance) {
        return
      }
      const data = {
        recipient: this.recipient,
        senderKey: sender.sk,
        amount: new BigNum(this.amountStax),
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
  },
  computed: {
    amountStax () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_CURRENT_ACCOUNT]
      if (!sender || !sender.balance) {
        return
      }
      return Math.floor(sender.balance / 1000)
    },
    configuration () {
      // const content = this.$store.getters['contentStore/getProductPage']('lsat')
      const myKey = 'satoshi-jokes'
      // const height = this.$store.getters[SITE_CONSTANTS.KEY_SECTION_HEIGHT]
      const lookAndFeel = {
        labels: {
          orderMsg: 'Place order for \'Satoshi Jokes\' select number required and pay.',
          title: 'Pay With',
          subtitle: 'LSAT Pay',
          card1Label: 'Select payment option',
          card2Label1: 'Number of jokes required?',
          card2Label2: 'Select operation',
          card2Label3: 'Make Payment',
          card2Label4: 'Open Channel',
          button1Label: 'Back',
          button2Label: 'Next',
          quantityLabel: 'Jokes'
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
        paymentId: myKey,
        opcode: 'lsat-place-order',
        purchaseEndpoint: '/assets/buy-now',
        apiKey: 'demo-digital-01234',
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
