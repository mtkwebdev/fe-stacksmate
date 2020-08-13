<template>
<div class="container">
  <h1 class="mb-4">Stack Transfers!</h1>
  <p>To move stacks around you can;
    <ul>
      <li>drop in your stacks address or use your blockstack id</li>
      <li>Use blockstacks network (default) or our risidio provider - or run your own stacks 2.0 blockchain</li>
      <li>tell us the Bitcoin adress to send your rewards to.</li>
    </ul>
  </p>
  <p>Remember that to broadcast transactions you'll need to sign them with a private key!</p>
  <div>
    <transfer-direct-form/>
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
import TransferDirectForm from '@/components/transfers/TransferDirectForm'

export default {
  name: 'TransferManagement',
  components: {
    TransferDirectForm
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
