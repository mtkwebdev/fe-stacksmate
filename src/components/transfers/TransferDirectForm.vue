<template>
<div class="container">
  <div class="mt-5">
    <b-form>
      <label class="mb-2 sr-only" for="inline-form-input-name">Transfers</label>
      <b-input
        ref="sender"
        v-model="sender"
        class="mt-5"
        placeholder="Sender Stax Address"></b-input>
      <b-form-text>
        <span @click="useMyWallet('sender')">Use my address</span> <span v-if="playMode" @click="useTestWallet('sender')">| Use test address</span>
      </b-form-text>
      <b-input
        ref="recipient"
        v-model="recipient"
        class="mt-5"
        placeholder="Recipient Stax Address"></b-input>
      <b-form-text>
        <span @click="useMyWallet('recipient')">Use my address</span> <span v-if="playMode" @click="useTestWallet('recipient')">| Use test address</span>
      </b-form-text>
      <b-input
        style="width: 500px;"
        id="amountMicroStax"
        ref="amount"
        v-model="amountMicroStax"
        class="mt-5"
        placeholder="Amount to send - units of micro stax - 1,000,000 = 1 STX"></b-input>
      <b-input
        style="width: 500px;"
        ref="memo"
        class="mt-5"
        maxlength=34
        v-model="memo"
        placeholder="Note to self or reminder of reason for transfer?"></b-input>
      <b-form-text v-if="memo">
        {{memo.length}} / 34
      </b-form-text>
      <b-button v-if="recipient" class="mt-3 btn-sm bg-info" @click="makeTransfer()">Transfer</b-button>
    </b-form>
    <div class="container m-5">
      {{result}}
    </div>
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
      if (!this.amountMicroStax || this.amountMicroStax < 0.0000001) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Amount of STX to send must be at least 1 micro stax!' })
        result = false
      }
      if (this.amountMicroStax > 100000000) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Amount of STX to send must be at least 1 micro stax!' })
        result = false
      }
      if (provider === 'risidio' && !sender) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'For Risidio provider please select a test account!' })
        result = false
      }
      if (!sender.balance || sender.balance < this.amountMicroStax) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Sender does not have enough stax to make this transfer!' })
        result = false
      }
      return result
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
    },
    useMyWallet: function (field) {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
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
        this.$notify({ type: 'warn', title: 'Play Mode', text: 'No test wallet selected!' })
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
    amountStax () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return
      }
      return Math.floor(sender.balance / 1000)
    },
    playMode () {
      const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
      return playMode
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  text-transform: uppercase;
}
</style>
