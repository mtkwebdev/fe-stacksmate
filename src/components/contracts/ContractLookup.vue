<template>
<div class="container">
  <div>
    <p>Lookup a contract - enter the contract address and name to fetch it directly from the Stack 2.0
    blockchain.</p>
    <b-input
      ref="stacksAddress"
      v-model="contractAddress"
      class="mt-3"
      placeholder="Stacks Address"></b-input>
      <a v-if="currentWallet" href="#" @click.prevent="useWalletAddress">use my address</a>
    <b-input
      ref="contractName"
      v-model="contractName"
      class="mt-3"
      placeholder="Contract Name"></b-input>
    <b-row>
      <b-col lg="4" class="pb-2">
        <button size="sm" v-if="contractAddress && contractName" class="mr-2 mt-3 bg-info" @click="lookupContract()">Lookup Contract</button>
        <button size="sm" v-if="contractSource" class="mt-3 bg-info" @click="lookupInterface()">Fetch Interface</button>
      </b-col>
    </b-row>
  </div>
  <div v-if="contractSource" class="source-code">
    <div v-html="contractSource"/>
  </div>
  <div v-if="contractSourceError" class="source-code">
    <div v-html="contractSourceError"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ContractLookup',
  components: {
  },
  props: ['lookAndFeel'],
  data () {
    return {
      loading: true,
      contractAddress: null,
      contractName: null,
      contractFound: false,
      contractSource: null,
      contractSourceError: null,
      response: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    useWalletAddress: function () {
      const address = this.$store.getters[APP_CONSTANTS.KEY_STAX_ADDRESS]
      if (address) {
        this.contractAddress = address
        return
      }
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (sender && sender.keyInfo.address) {
        this.contractAddress = sender.keyInfo.address
      }
    },
    lookupContract: function () {
      this.selected = '/v2/contracts/source/{stacks_address}/{contract_name}'
      const address = this.doSubstitutions()
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      const ep = endpoints.find(item => item.value === this.selected)
      this.response = null
      this.$store.dispatch('fireEvent', { path: address, httpMethod: ep.method, postData: null }).then(response => {
        this.response = response
        this.contractSource = '<pre>' + response.source + '</pre>'
      }).catch((error) => {
        console.log(error)
        this.contractSourceError = error
      })
    },
    doSubstitutions: function () {
      let address = this.selected
      if (this.selected && this.selected.indexOf('contract_name') > -1) {
        address = address.replace('{contract_name}', this.contractName)
      }
      if (this.selected && this.selected.indexOf('stacks_address') > -1) {
        address = address.replace('{stacks_address}', this.contractAddress)
      }
      return address
    }
  },
  computed: {
    currentWallet () {
      const address = this.$store.getters[APP_CONSTANTS.KEY_STAX_ADDRESS]
      if (address) {
        return true
      }
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.keyInfo.address) {
        return false
      }
      return true
    },
    endpoints () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      // endpoints = endpoints.map(item => item.value)
      return endpoints
    }
  }
}
</script>
<style lang="scss" scoped>
.source-code {
  background: #e7eda3;
  border: 2pt solid #342343;
  padding: 25px;
}
.iface-code {
  background: #342343;
  border: 2pt solid #e7eda3;
  color: #e7eda3;
  padding: 25px;
}
</style>
