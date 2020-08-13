<template>
<div v-if="loading">
  loading
</div>
<b-form v-else>
  <div class="my-3">
    <b-input
      class="mt-3"
      ref="accountText"
      v-model="account.label"
      placeholder="Account label"></b-input>
    <b-input
      class="mt-3"
      readonly
      ref="accountValue"
      v-model="account.keyInfo.address"
      placeholder="Address"></b-input>
    <b-input
      class="mt-3"
      ref="accountSk"
      readonly
      v-model="account.keyInfo.privateKey"
      placeholder="Private key"></b-input>
    <div class="mt-3">
      <b-button class="mr-3 btn-sm bg-info" @click="createAccount()">Create Account</b-button>
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
      account: {
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
    this.$store.dispatch('transactionStore/makeKey').then((account) => {
      if (account && account.keyInfo) this.account = account
      this.loading = false
    })
  },
  methods: {
    createAccount: function () {
      this.$emit('createAccount', this.account)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
