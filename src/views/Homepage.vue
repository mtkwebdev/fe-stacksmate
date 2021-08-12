<template>
<section class="" id="section-upload" v-if="!loading">
  <b-container fluid class="mt-5">
    <b-row class="text-small" v-if="profile.loggedIn">
      <b-col cols="12" v-if="getBalance < 0">
        <p>You have {{getBalance}} STX tokens in this account - more than enough to pay the
          mint fees!</p>
        <p><a target="_blank" href="https://thisisnumberone.com/nft-gallery">Mint NFTs and display them here</a></p>
        <ExchangeRates :displayMode="'homepage'"/>
      </b-col>
      <b-col md="12" sm="12" v-else>
        <div class="w-md-75">
          <p class="mb-3">Your account has {{getBalance}} STX tokens</p>
          <p class="mb-2">This service lets you swap other currency for a small amount of STX tokens to get you started
            exploring the user owned Internet. With this you can;</p>
          <ul>
            <li>pay the (very small) transaction fees to deploy smart contracts <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'A small gas fee used to incentivise the network and keep it running'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
            <li>pay the (very small) transaction fees to call smart contracts <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'This is a small fee that is shared by all the people who are working to keep the network secure and transparent'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
            <li>cover minting fees charged by apps - e.g. to create NFTs <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'This is set by the app where you do you minting and will vary from app to app'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
          </ul>
        </div>
        <b-jumbotron bg-variant="dark">
          <template #lead>
            <p class="text-small" v-html="paymentMessage"></p>
          </template>
          <hr class="my-4">
        <div class="w-md-75">
          <label class="mt-5 d-flex justify-content-between" for="item-name">
            <span>Send the STX to</span>
            <b-link v-if="recipient !== profile.stxAddress" class="text-info" @click.prevent="useMyAddress">use my address</b-link>
          </label>
          <b-form-input
            id="item-name"
            v-model="recipient"
            aria-describedby="item-name-help item-name-feedback"
            placeholder="Recipient address - where to send the STX tokens for the swap"
            trim></b-form-input>
          <p class="my-2 text-right"><b-button variant="outline-warning" @click="showPayment">Continue</b-button></p>
        </div>
        <b-row v-if="smWallet">
          <b-col cols="12"><b-link class="text-info" @click.prevent="showSMWallet = !showSMWallet">StacksMate Wallet Info <b-icon :icon="(showSMWallet) ? 'arrow-down' : 'arrow-up'"/></b-link></b-col>
        </b-row>
        <b-row v-if="showSMWallet" class="text-small py-3">
          <b-col cols="2">Balance:</b-col>
          <b-col cols="10">{{smWallet.accountInfo.balance}}</b-col>
          <b-col cols="2">Counter:</b-col>
          <b-col cols="10">{{smWallet.accountInfo.nonce}}
            <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'danger' }" :title="'The tx counter (nonce) keeps track of the transactions sent from our address - it is incremented by the network once the transaction is mined. For our purposes it limits the number of StacksMate payments we can make at a given time - for this reason we prevent payments while a transfer is in progress. This slows down our service right now because of slow Stacks Tx times. This issue will be resolved soon.'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link>
          </b-col>
          <b-col md="2" sm="12">Address:</b-col>
          <b-col md="10" sm="12">{{smWallet.stxAddress}}</b-col>
        </b-row>
      </b-jumbotron>
      </b-col>
    </b-row>
    <b-row style="min-height: 30vh" class="text-center" v-else-if="webWalletNeeded">
      <b-col cols="12"><p>You need to download the web wallet to login and start minting your very own NFTs!</p></b-col>
      <b-col cols="12"><p><a class="text-white pointer mx-4" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></p></b-col>
      <b-col cols="12"><p>Then come back here and reload this tab.. we'll give you the next steps.</p></b-col>
    </b-row>
    <b-row  class="text-center" v-else>
      <b-col cols="12"><p>Please login to get started!</p></b-col>
    </b-row>
    <b-row v-if="nottrue">
      <b-col><TokenConversions/></b-col>
    </b-row>
    <b-row v-if="redirectUrl">
      <b-col><a :href="redirectUrl">Go Home</a></b-col>
    </b-row>
  </b-container>
  <b-modal size="md" id="payment-modal" centered>
    <PaymentFlow v-if="showRpay" :configuration="configuration" :recipient="recipient"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PaymentFlow from '@/components/onchain/payments/PaymentFlow'
import TokenConversions from '@/components/tokens/TokenConversions'

export default {
  name: 'Homepage',
  components: {
    PaymentFlow,
    TokenConversions
  },
  data () {
    return {
      loading: true,
      showSMWallet: false,
      configuration: null,
      stacksMateAccount: null,
      recipient: null,
      redirectUrl: null,
      nottrue: false,
      showRpay: false,
      amountFiat: 5
    }
  },
  watch: {
  },
  mounted () {
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
    configuration.risidioCardMode = 'payment-flow'
    this.configuration = configuration
    this.loading = false
    const data = { stxAddress: process.env.VUE_APP_STACKS_TRANSFER_ADDRESS }
    this.$store.dispatch('rpayAuthStore/fetchAccountInfo', data)
    if (this.$route.query && this.$route.query.stxAddress) {
      this.recipient = this.$route.query.stxAddress
    }
    if (!this.recipient && this.profile.loggedIn) {
      this.recipient = this.profile.stxAddress
    }
    if (this.$route.query.redirectUrl) {
      this.redirectUrl = this.$route.query.redirectUrl
    }
    this.loading = false
  },
  methods: {
    showPayment () {
      this.showRpay = true
      this.$bvModal.show('payment-modal')
      this.$store.dispatch('fetchAddressInfo', this.recipient).then(() => {
        this.showRpay = true
        this.$bvModal.show('payment-modal')
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Account Error', text: err })
      })
    },
    useMyAddress: function () {
      this.recipient = this.profile.stxAddress
    }
  },
  computed: {
    paymentMessage () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      if (!configuration) return ''
      return '<div>Swap <span class="text-warning">' + configuration.payment.amountFiat + '</span> ' + configuration.payment.currency + ' for <span class="text-warning">' + configuration.payment.amountStx + '</span> STX</div><div class="mt-3">Send the STX to:</span> <span class="text-warning">' + this.recipient + '</div>'
    },
    getBalance () {
      return (this.profile && this.profile.accountInfo) ? this.profile.accountInfo.balance : 0
    },
    smWallet () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const accountInfo = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      return accountInfo
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    webWalletNeeded () {
      const webWalletNeeded = this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_NEEDED]
      return webWalletNeeded
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
