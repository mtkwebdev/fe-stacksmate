<template>
<b-form>
  <div class="my-3">
    <b-input
      class="mt-3"
      ref="accountText"
      v-model="account.label"
      placeholder="Account label"></b-input>
    <b-input
      class="mt-3"
      ref="accountSk"
      v-model="account.keyInfo.privateKey"
      placeholder="Private key"></b-input>
    <div class="text-danger">Note: this is for test purposes only - don't enter seeds / private keys in web sites unless you are clear about the reason.</div>
    <div class="mt-3">
      <b-button @click="importAccount()" variant="warning" class="text-white button1" style="width: 49%;">Import Wallet</b-button>
    </div>
  </div>
</b-form>
</template>

<script>

export default {
  name: 'WalletImportAccount',
  components: {
  },
  data () {
    return {
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
    this.loading = false
  },
  methods: {
    importAccount: function () {
      this.$emit('importAccount', this.account)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
