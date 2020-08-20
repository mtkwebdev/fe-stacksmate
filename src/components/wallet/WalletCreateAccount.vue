<template>
<div v-if="loading">
  loading
</div>
<b-form v-else>
  <div class="my-3">
    <b-input
      class="mt-3"
      ref="accountText"
      v-model="wallet.label"
      placeholder="Account label"></b-input>
    <b-input
      class="mt-3"
      readonly
      ref="accountValue"
      v-model="wallet.keyInfo.address"
      placeholder="Address"></b-input>
    <b-input
      class="mt-3"
      ref="accountSk"
      readonly
      v-model="wallet.keyInfo.privateKey"
      placeholder="Private key"></b-input>
    <div class="text-danger">Note: this is for test purposes only - don't enter seeds / private keys in web sites unless you are clear about the reason.</div>
    <div class="mt-3">
      <b-button @click="createAccount()" variant="warning" class="text-white button1" style="width: 49%;">Create Wallet</b-button>
    </div>
  </div>
</b-form>
</template>

<script>
export default {
  name: 'WalletCreateAccount',
  components: {
  },
  data () {
    return {
      loading: true,
      wallet: {
        label: null,
        keyInfo: {
          privateKey: null,
          address: null,
          btcAddress: null
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('transactionStore/makeKey').then((wallet) => {
      if (wallet && wallet.keyInfo) this.wallet = wallet
      this.loading = false
    })
  },
  methods: {
    createAccount: function () {
      this.$emit('createAccount', this.wallet)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
