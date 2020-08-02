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
    <div class="mt-3">
      <b-button class="mr-3 btn-sm bg-info" @click="importAccount()">Import Account</b-button>
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
