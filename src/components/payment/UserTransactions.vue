<template>
<b-container>
<b-row class="text-small pb-3">
  <b-col cols="12">
    <div v-for="(transaction, index) in transactions" :key="index" class="mb-3">
      <UserTransaction :transaction="transaction" @txEvent="txEvent"/>
    </div>
  </b-col>
</b-row>
  <b-modal size="lg" id="feedback-modal" class="mt-5 text-dark text-left">
    <b-container class="text-white">
      <b-row>
        <b-col cols="12" class="my-4">
          <label for="name">Email</label>
          <b-form-input
            id="name"
            v-model="fromEmail"
            aria-describedby="email-help email-feedback"
            placeholder="Email - optional - just used to reply"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" class="my-4">
          <label for="feedback">Feedback!</label>
          <b-form-textarea
            ref="feedback"
            v-model="feedback"
            rows="5"
            style="padding: 20px 20px;"
            ></b-form-textarea>
            <div class="my-4 text-left"><b-button class="" variant="info" @click="registerFeedback">Send</b-button></div>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>

</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import UserTransaction from './UserTransaction'

export default {
  name: 'StacksMateWallet',
  components: {
    UserTransaction
  },
  data () {
    return {
      transaction: null,
      fromEmail: null,
      feedback: ''
    }
  },
  props: ['recipient'],
  mounted () {
  },
  methods: {
    registerFeedback: function () {
      this.feedback += '\nFrom Email=' + this.fromEmail
      const data = {
        emailContent: this.feedback,
        status: 0,
        domain: location.host,
        assetHash: this.transaction.id,
        email: 'mike@thisisnumberone.com'
      }
      this.$bvModal.hide('feedback-modal')
      this.$store.dispatch('rpayPurchaseStore/registerForUpdates', data).then((result) => {
        this.$notify({ type: 'success', title: 'Feedback', text: 'Thanks for your feedback - we will look inot it.' })
      })
    },
    txEvent (transaction) {
      this.transaction = transaction
      this.feedback += '<type message here>'
      this.feedback += '\n\n\nTransaction details..'
      this.feedback += '\nId=' + this.transaction.id
      this.feedback += '\nStacks Transaction Id=' + this.transaction.txId
      this.feedback += '\nStatus=' + this.transaction.txStatus
      this.feedback += '\nPayment Code=' + this.transaction.paymentCode
      this.feedback += '\nPayment Id=' + this.transaction.paymentId
      this.$bvModal.show('feedback-modal')
    }
  },
  computed: {
    transactions () {
      const transactions = this.$store.getters[APP_CONSTANTS.KEY_USER_TRANSACTIONS](this.profile.stxAddress)
      return transactions
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
