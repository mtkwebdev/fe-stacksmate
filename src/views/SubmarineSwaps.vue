<template>
<div class="container">
  <div>
    <h1 class="mb-4">Get Stacking!</h1>
    <p>To get stacking now;
      <ul>
        <li>drop in your stacks address</li>
        <li>indicate the amount of STX you want to lock per reward cycle</li>
        <li>tell us the Bitcoin adress to send your rewards to.</li>
      </ul>
    </p>
    <p>We provide a test wallet if you just want to try out the process - ensure your
      logged out and click 'play mode' for test wallets.<p>
    <p>We also provide submarine swaps Lightning BTC into STX tokens (using the LSAT 402 payments flow).</p>
  </div>
  <div>
    <transfer-lsat-form @paymentEvent="paymentEvent"/>
  </div>
  <div>
    <div class="container m-5">
      {{result}}
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import TransferLsatForm from '@/components/transfers/TransferLsatForm'

export default {
  name: 'SubmarineSwaps',
  components: {
    TransferLsatForm
  },
  props: ['lookAndFeel'],
  data () {
    return {
      loading: true,
      amountMicroStax: null,
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
  },
  computed: {
    amountStax () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return
      }
      return Math.floor(sender.balance / 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  text-transform: uppercase;
}
</style>
