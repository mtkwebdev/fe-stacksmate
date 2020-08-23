<template>
<div class="">
  <div class="d-flex justify-content-center" v-if="configuration">
    <rpay-entry :paymentConfig="configuration" @paymentEvent="rpayEvent"/>
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
    rpayEvent: function (event) {
      const paymentEvent = event.detail[0]
      if (paymentEvent.opcode !== 'lsat-payment-confirmed') {
        return
      }
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      const recipientWallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      paymentEvent.recipient = (recipientWallet) ? recipientWallet.keyInfo.address : null
      paymentEvent.amount = paymentEvent.numbCredits
      paymentEvent.provider = provider
      paymentEvent.txtype = 'rpay-swap'
      paymentEvent.nonce = 0
      if (paymentEvent.recipient) {
        this.$emit('rpayEvent', paymentEvent)
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
    }
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
    amountStax () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return
      }
      return Math.floor(sender.balance / 1000)
    },
    configuration () {
      const lookAndFeel = {
        labels: {
          orderMsg: 'Send us a tip on lightning in exchange for some testnet \'STX Tokens\'.',
          successMsg: 'Your STX order for has been received with thanks.',
          title: 'rPay',
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
          color: '#000'
        },
        text2Color: {
          color: '#FFCE00'
        },
        text3Color: {
          color: '#fff'
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
          // 'background-image': 'url("https://images.prismic.io/risidio-journal/59455bcb-a954-4713-9afd-cfe6130f0b26_Group+994.svg?auto=compress,format")',
          opacity: 0.9
        }
      }
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      if (!exchangeRate) {
        return
      }
      // const testnetRate = exchangeRate.amountStx / 10000
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      const productOrder = {
        paymentId: null,
        opcode: 'rpay-place-order',
        purchaseEndpoint: '/assets/buy-now',
        serviceKey: 'stax-lightning-exchange',
        serviceData: {
          stxAddress: profile.stxAddress
        },
        apiKey: 'mesh-1',
        lookAndFeel: lookAndFeel,
        paymentOptions: { allowLightning: true, allowEthereum: false, allowBitcoin: false, allowStacks: false },
        paymentOption: 'lightning',
        creditAttributes: {
          amountFiatFixed: 0.10,
          amountFiatPerCredit: 0,
          precision: 1000,
          fiatCurrency: 'EUR',
          useCredits: false,
          start: 0.05,
          step: 0.01,
          min: 0.01,
          max: 1
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
</style>
