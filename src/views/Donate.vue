<template>
<div class="mx-2">
  <div class="mb-5 mt-0">
    <div class="mb-3 tagline">Risidio <span class="tagline1">Crowdfund</span></div>
    <div class="mb-2">Everything we do at Risidio is about promoting Stacks, Bitcoin and Lightning networks.
      we believe in a decentralised future and even our crowdfunding module
      is designed with these goals in mind.</div>
    <div class="mb-2">This crowdfunding module is available as open source web component you can plug
      into your own website - <a href="https://github.com/radicleart/fe-mesh" target="_blank">fork the project</a> - and get in touch for more info.</div>
  </div>
  <div class="">
    <div class="level1">
      <rpay-entry :paymentConfig="configuration" @paymentEvent="rpayEvent"/>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

const STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS

export default {
  name: 'Donate',
  components: {
  },
  data () {
    return {
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
      paymentEvent.amount = paymentEvent.numbCredits
      paymentEvent.txtype = 'rpay-swap'
      paymentEvent.nonce = 0
      if (paymentEvent.recipient) {
        this.$emit('rpayEvent', paymentEvent)
      }
    }
  },
  computed: {
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
          'max-width': '500px',
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
      const config = {
        paymentId: null,
        purchaseEndpoint: '/assets/buy-now',
        authHeaders: this.$store.getters[APP_CONSTANTS.KEY_AUTH_HEADERS],
        serviceKey: 'stacks-lightning-exchange',
        serviceData: {
          stxAddress: STX_PAYMENT_ADDRESS
        },
        apiKey: 'stacksmate',
        lookAndFeel: lookAndFeel,
        paymentOptions: { allowLightning: true, allowEthereum: false, allowBitcoin: false, allowStacks: false },
        paymentOption: 'lightning',
        mode: 'rpay-crowdfund'
      }
      const po = JSON.stringify(config)
      window.risidioPaymentConfig = po
      return po
    }
  }
}
</script>
<style lang="scss">
</style>
