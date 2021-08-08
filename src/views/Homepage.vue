<template>
<section class="" id="section-upload">
  <b-container class="mt-5 pt-5">
    <b-row style="min-height: 10vh" v-if="profile.loggedIn">
      <b-col cols="12" v-if="getBalance < 0">
        <p>You have {{getBalance}} STX tokens in this account - more than enough to pay the
          mint fees!</p>
        <p><a target="_blank" href="https://thisisnumberone.com/nft-gallery">Mint NFTs and display them here</a></p>
        <ExchangeRates :displayMode="'homepage'"/>
      </b-col>
      <b-col md="8" offset-md="2" sm="10" offset-sm="1" v-else>
        <p class="mb-5 text-center">Your account has 0 STX tokens</p>
        <p class="mb-2 text-center">A small amount of STX token is needed to mint a new NFT.
          This is to cover
        </p>
        <ul class="ml-5">
          <li>The minting fee charged by the app <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'This is set by the app where you do you minting and will vary from app to app'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
          <li>The network (also known as the gas) fee <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'This is a small fee that is shared by all the people who are working to keep the network secure and transparent'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
        </ul>
        <label class="mt-5" for="item-name">Recipient Address (<a href="#" @click.prevent="useMyAddress">use mine</a>)</label>
        <b-form-input
          id="item-name"
          v-model="stxAddress"
          aria-describedby="item-name-help item-name-feedback"
          placeholder="Recipient address - where to send the STX tokens for the swap"
          trim></b-form-input>
          <p class="my-2 text-right"><b-button variant="outline-warning" @click="showPayment">Continue</b-button>
        </p>
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
    <b-row>
      <b-col><TokenConversions/></b-col>
    </b-row>
    <b-row class="text-right" v-if="redirectUrl">
      <b-col><a :href="redirectUrl">Go Home</a></b-col>
    </b-row>
  </b-container>
  <b-modal size="md" id="payment-modal" centered>
    <RisidioPay v-if="showRpay" :configuration="configuration"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RisidioPay from 'risidio-pay'
import TokenConversions from '@/components/tokens/TokenConversions'

export default {
  name: 'Homepage',
  components: {
    RisidioPay,
    TokenConversions
  },
  data () {
    return {
      configuration: null,
      stxAddress: null,
      redirectUrl: null,
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
    if (this.$route.query && this.$route.query.stxAddress) {
      this.stxAddress = this.$route.query.stxAddress
    }
    if (!this.stxAddress && this.profile.loggedIn) {
      this.stxAddress = this.profile.stxAddress
    }
    if (this.$route.query.redirectUrl) {
      this.redirectUrl = this.$route.query.redirectUrl
    }
    this.setupEventListener()
  },
  methods: {
    setupEventListener () {
      const $self = this
      this.loading = false
      if (window.eventBus && window.eventBus.$on) {
        window.eventBus.$on('rpayEvent', function (data) {
          if (data.opcode === 'stx-transaction-finished') {
            const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
            $self.$store.commit('setModalMessage', txResult)
            $self.closeModal()
          } else if (data.opcode.indexOf('-payment-end') > -1) {
            const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode })
            $self.$store.commit('setModalMessage', txResult)
            $self.closeModal()
          } else if (data.opcode === 'configured-logged-in') {
            $self.$store.commit('setModalMessage', 'Welcome to stacksmate - getting started with NFTs')
            $self.closeModal()
          } else if (data.opcode.indexOf('-payment-success') > -1) {
            const payment = $self.$store.getters[APP_CONSTANTS.KEY_PAYMENT_CONVERT](data)
            $self.$store.dispatch('paymentStore/newPayment', payment).then((payment) => {
              $self.$bvModal.hide('payment-modal')
              $self.showRpay = false
              $self.$store.commit('setModalMessage', 'Thank you for your support. ')
              $self.$root.$emit('bv::show::modal', 'waiting-modal')
            }).catch(() => {
              $self.$store.commit('setModalMessage', 'Payment error - we will check into it - thank you for your support.')
              $self.$root.$emit('bv::show::modal', 'waiting-modal')
            })
          } else {
            $self.$store.commit('setModalMessage', 'Payment error - unkown code - ', data)
            $self.$root.$emit('bv::show::modal', 'waiting-modal')
          }
        })
      }
    },
    closeModal () {
      this.$root.$emit('bv::hide::modal', 'waiting-modal')
      this.$bvModal.hide('payment-modal')
    },
    paymentEvent: function (ev) {
      const data = ev.detail[0]
      this.$store.dispatch('paymentStore/receivePayment', data).then(() => {
        this.$emit('paymentEvent', data)
      })
    },
    showPayment () {
      this.$store.dispatch('fetchAddressInfo', this.stxAddress).then(() => {
        this.showRpay = true
        this.$bvModal.show('payment-modal')
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Account Error', text: err })
      })
    },
    useMyAddress: function () {
      this.stxAddress = this.profile.stxAddress
    }
  },
  computed: {
    getBalance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.accountInfo) ? profile.accountInfo.balance : 0
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
