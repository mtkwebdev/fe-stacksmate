<template>
<div class="">
    <b-form>
      <div class="mb-2">Choose a sender stacks address</div>
      <b-input
        ref="sender"
        v-model="sender"
        class=""></b-input>
      <div class="mt-2 d-flex justify-content-end">
        <a href="#" class="wallet-use text-white" @click.prevent="useMyWallet('sender')">Use my address</a> <a href="#" class="ml-3 wallet-use text-info" v-if="playMode" @click.prevent="useTestWallet('sender')">Use test address</a>
      </div>

      <div class="pl-5 mt-4 mb-2 border-left" :style="(!sender) ? 'opacity: 0.3' : ''" style="height: 100px;">
        <div class="mb-2">Amount STX</div>
        <b-input
          id="amountStax"
          ref="amount"
          v-model="amountStax"
          class="mt-3"></b-input>
        <div class="mt-2 d-flex justify-content-end">
          <a href="#" class="wallet-use text-white" @click.prevent="useMax()">max {{getMax}} <span class="text-light">(balance - tx fee)</span></a>
        </div>
      </div>

      <div class="mt-3 mb-2" :style="(!amountStax) ? 'opacity: 0.3' : ''">
        <div class="mb-2">Recipient Stacks Address</div>
        <b-input
          ref="recipient"
          v-model="recipient"
          class="mt-3"></b-input>
        <div class="mt-2 d-flex justify-content-end">
          <a href="#" class="wallet-use text-white" @click.prevent="useMyWallet('recipient')">Use my address</a> <a href="#" class="ml-3 wallet-use text-info" v-if="playMode" @click.prevent="useTestWallet('recipient')">Use test address</a>
        </div>
      </div>

      <div :style="(!recipient) ? 'opacity: 0.3' : ''" class="mb-2">
        <div class="mb-2">Description / Notes <span class="text-light">({{memo.length}} / 34)</span></div>
      <b-input
        ref="memo"
        class="mt-3"
        maxlength=34
        v-model="memo"></b-input>
      </div>

      <div class="mb-2" v-if="valid">
        <b-button v-if="recipient" variant="light" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" @click.prevent="makeTransfer()">Transfer {{amountStax}} Micro Stacks</b-button>
      </div>
    </b-form>
    <div class="my-5">
      {{result}}
    </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'TransferDirectForm',
  components: {
  },
  data () {
    return {
      loading: true,
      amountStax: null,
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
    validate: function (provider, sender) {
      let result = true
      if (!this.recipient || !this.sender) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Sender and reecipient both required!' })
        result = false
      }
      if (this.recipient === this.sender) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Sender and recipient can\'t be the same!' })
        result = false
      }
      if (!this.amountStax || this.amountStax < 0.00001) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Amount of STX to send must be at least 0.00001 stax!' })
        result = false
      }
      if (provider === 'risidio' && !sender) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'For Risidio provider please select a test account!' })
        result = false
      }
      if (!sender.balance || sender.balance < this.amountStax) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Sender does not have enough stax to make this transfer!' })
        // result = false
      }
      const userWallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      if (provider === 'risidio' && sender.keyInfo.address === userWallet.keyInfo.address) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Risidio provider is not able to sign your transaction - use the local or  Blockstack PBC Provider for this. Note support for getting your wallet to sign the transaction for us to broadcast is coming soon.' })
        result = false
      }
      return result
    },
    valid () {
      return this.recipient && this.sender && this.amountStax
    },
    makeTransfer: function () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      let wallet1 = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.sender)
      if (!wallet1) {
        wallet1 = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      }
      const wallet2 = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]

      let sender = null
      if (wallet1 && this.sender === wallet1.keyInfo.address) {
        sender = wallet1
      } else if (wallet2 && this.sender === wallet2.keyInfo.address) {
        sender = wallet2
      }

      if (!this.validate(provider, sender)) {
        return
      }

      const data = {
        recipient: this.recipient,
        fromAddress: (sender) ? sender.keyInfo.address : null,
        senderKey: (sender) ? sender.keyInfo.privateKey : null,
        amount: this.amountStax,
        nonce: sender.nonce,
        provider: provider,
        txtype: 'transfer',
        memo: this.memo
      }
      if (provider === 'blockstack') {
        this.$store.dispatch('authStore/makeTransferBlockstack', data).then((result) => {
          this.$emit('transferEvent', result)
        }).catch((error) => {
          this.result = error
        })
      } else {
        this.$store.dispatch('authStore/makeTransferRisidio', data).then((result) => {
          this.$emit('transferEvent', result)
        }).catch((error) => {
          this.result = error
          this.$notify({ type: 'error', title: 'Transfers', text: 'Error message: ' + error })
        })
      }
    },
    useMax: function (field) {
      if (!this.sender) return
      let wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.sender)
      if (!wallet || !wallet.keyInfo) {
        wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      }
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'error', title: 'Wallet Error', text: 'No wallet found?!' })
        return
      }
      const precision = 10000000
      const feeEstimate = this.$store.getters[APP_CONSTANTS.KEY_FEE_ESTIMATE]
      if (feeEstimate) {
        this.amountStax = Math.round((wallet.balance - feeEstimate) * precision) / precision
      }
      this.amountStax = wallet.balance
    },
    useMyWallet: function (field) {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      if (!profile.loggedIn) {
        this.$notify({ type: 'error', title: 'Account', text: 'Please log in to use this feature.' })
        return
      }
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'error', title: 'Network Error', text: 'No network detected - is stax 2.0 blockchain running?!' })
        return
      }
      if (field === 'sender') {
        this.sender = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
      } else {
        this.recipient = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
      }
    },
    useTestWallet: function (field) {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!wallet || !wallet.keyInfo) {
        this.$notify({ type: 'warn', title: 'Dev Mode', text: 'No test wallet selected!' })
        return
      }
      if (field === 'sender') {
        this.sender = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
      } else {
        this.recipient = (wallet && wallet.keyInfo) ? wallet.keyInfo.address : ''
      }
    }
  },
  computed: {
    getMax: function () {
      let wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.sender)
      if (!wallet || !wallet.keyInfo) {
        wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      }
      if (!wallet || !wallet.keyInfo) {
        return 0
      }
      const precision = 10000000
      const feeEstimate = this.$store.getters[APP_CONSTANTS.KEY_FEE_ESTIMATE]
      if (feeEstimate) {
        return Math.round((wallet.balance - feeEstimate) * precision) / precision
      }
      return wallet.balance
    },
    playMode () {
      const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
      return playMode
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
