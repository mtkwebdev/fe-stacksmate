<template>
  <Scene>
    <Property name="clearColor" color="#ccc"></Property>
    <Camera type="universal" ></Camera>
    <HemisphericLight>
    </HemisphericLight>
    <Box :position="[0, 0, 0]">
      <Material diffuse="#41B883" specular="#41B883"></Material>
      <Animation property="rotation.x" :duration="200" :end="Math.PI * 4"></Animation>
      <Animation property="rotation.y" :duration="200" :end="Math.PI * 4"></Animation>
    </Box>
    <Asset src="https://www.babylonjs-playground.com/scenes/skull.babylon" :scaling="[0.02, 0.02, 0.02]" :position="[4, 0.5, 0]"></Asset>
    <Asset src="https://www.babylonjs-playground.com/scenes/StanfordBunny.obj" :scaling="[7.5, 7.5, 7.5]" :position="[-4, -0.25, -0.5]" :rotation="[0, Math.PI, 0]"></Asset>
    <Asset src="https://rawgit.com/saswata26/misc/master/base.stl" :scaling="[0.02, 0.02, 0.02]" :position="[-2, 0, -0.5]"></Asset>
    <Entity :position="[0, 0, 5]">
      <Animation property="rotation.x" :duration="100">
        <Key frame="0%" :value="0"></Key>
        <Key frame="100%" :value="Math.PI * 2"></Key>
      </Animation>
      <Animation property="rotation.y" :duration="50" :end="Math.PI * 2"></Animation>
      <Animation property="rotation.z" :duration="50" :end="Math.PI * 2"></Animation>
      <PointLight diffuse="#FF0000"></PointLight>
      <template v-for="x in [0, 4, -4]">
        <template v-for="y in [0, 4, -4]">
          <Box v-for="z in [0, 4, -4]" :position="[x, y, z]" :key="`${x},${y},${z}`"></Box>
        </template>
      </template>
    </Entity>
  </Scene>
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
