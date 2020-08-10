<template>
<div class="container">
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Deploy New Contract" active><contract-source-code @lookupEvent="lookupEvent"/></b-tab>
      <b-tab title="Lookup Contract"><contract-lookup/></b-tab>
      <b-tab title="Contract History"><contract-history/></b-tab>
    </b-tabs>
  </div>
  <div class="row">
    <div class="col-12">
      <pre>{{getResponse}}</pre>
    </div>
  </div>
  <b-modal scrollable id="modal-1" title="Result of Some Action">
  <div class="row">
    <div class="col-12 my-1">
      <div>some message</div>
    </div>
  </div>
  <template v-slot:modal-footer>
  </template>
</b-modal>

</div>
</template>

<script>
import ContractHistory from '@/components/contracts/ContractHistory'
import ContractSourceCode from '@/components/contracts/ContractSourceCode'
import ContractLookup from '@/components/contracts/ContractLookup'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ContractManagement',
  components: {
    ContractSourceCode,
    ContractHistory,
    ContractLookup
  },
  props: ['lookAndFeel'],
  data () {
    return {
      operation: 0,
      loading: true,
      lookup: false,
      response: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    lookupEvent: function () {
      this.lookup = true
    }
  },
  computed: {
    getResponse () {
      const response = this.$store.getters[APP_CONSTANTS.KEY_API_RESPONSE]
      return response
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
