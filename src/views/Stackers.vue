<template>
<div class="container mt-5">
  <div class="row">
    <div class="col-md-6 col-sm-12">
      <div class="" v-if="isRPay">
        <h4 class="mb-4">Use rPay to swap Lightning BTC for Stacks (STX) tokens</h4>
      </div>
      <div class="" v-else>
        <h4 class="mb-4">Transfer Stacks (STX) tokens to your address</h4>
      </div>
      <div class="border-bottom">
        <p>Once you have some STX you can;</p>
        <p>1. Earn bitcoin by stacking</p>
        <p>2. Deploy smart contracts</p>
        <p>3. Register digital assets</p>
      </div>
      <div class="my-4" v-if="isRPay">
        We charge the equivalent of a small tip to <span class="text-warning">Try it Out</span>
      </div>
      <div class="my-4" v-else>
        Try it out first? Use <span class="text-warning">Dev Mode</span>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <transfer-lsat-form @rpayEvent="rpayEvent" @transferEvent="transferEvent" v-if="isRPay"/>
      <transfer-direct-form @transferEvent="transferEvent" v-else/>
    </div>
  </div>
  <b-modal scrollable id="modal-1" title="Risidio Pay">
    <div class="row" v-if="paymentData">
      <div class="col-12 my-1">
        <div class="mb-3">Payment Received with thanks</div>
        <div class="mb-3">For {{paymentData.numbCredits}} STX Tokens</div>
        <div class="mb-3">Transfer to STX Address {{addressTrunc}} begun</div>
        <div v-if="loggedIn">Saving proof of payment (LSAT Macaroon) to your Gaia storage</div>
        <div v-else>Login to save proof of payment (LSAT Macaroon) to your Gaia storage</div>
      </div>
    </div>
    <template v-slot:modal-footer>
    </template>
  </b-modal>
  <b-modal scrollable id="modal-2" title="Stax Transfer">
    <div class="row" v-if="txData">
      <div class="col-12 my-1">
        <p>Sent {{txData.amount}} STX Tokens from {{txData.fromAddress}} to {{txData.recipient}}
        </p>
        <div>Check progress at <a target="_blank" :href="explorerUrl">testnet tx explorer</a></div>
      </div>
    </div>
    <template v-slot:modal-footer>
    </template>
  </b-modal>
</div>
</template>

<script>
import TransferLsatForm from '@/components/transfers/TransferLsatForm'
import TransferDirectForm from '@/components/transfers/TransferDirectForm'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Stackers',
  components: {
    TransferLsatForm,
    TransferDirectForm
  },
  data () {
    return {
      loading: true,
      localMode: 'rpay',
      paymentData: null,
      txData: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    rpayEvent: function (paymentData) {
      this.paymentData = paymentData
      if (this.paymentData.opcode === 'lsat-payment-confirmed') {
        this.$store.dispatch('rstackStore/saveMacaroon', this.paymentData).then((item) => {
          if (item && item.txData) {
            this.$bvModal.show('modal-1')
          } else {
            this.$notify({ type: 'success', title: 'Transfers', text: 'Payment recieved with thanks - details stored to your Gaia hub.' })
          }
        }).catch(() => {
          this.$notify({ type: 'error', title: 'Transfers', text: 'Payment recieved with thanks - unable to store details to your Gaia hub.' })
        })
      }
    },
    transferEvent: function (txData) {
      this.$notify({ type: 'info', title: 'Transfers', text: 'Transaction sent to Blockchain the transaction id=' + txData.result })
      this.txData = txData
      this.$store.dispatch('rstackStore/saveToGaia', txData).then((result) => {
        this.$bvModal.show('modal-2')
        this.$notify({ type: 'success', title: 'Transfers', text: 'Transaction saved to your Gaia storage bucket - id=' + txData.result })
      })
    }
  },
  computed: {
    explorerUrl () {
      return 'https://testnet-explorer.blockstack.org/txid/' + this.txData.result
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.loggedIn
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
    isRPay () {
      return this.$route.name === 'get-stacks'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
