<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <wallets />
    </div>
  </div>
  <div>
    <h4>Find Contract on the Stacks Blockchain</h4>
      <!-- <b-form-select v-model="selected" :options="endpoints"></b-form-select> -->
      <b-input
        ref="stacksAddress"
        v-model="contractAddress"
        class="mt-3"
        placeholder="Stacks Address"></b-input>
        <a v-if="currentWallet" href="#" @click.prevent="useWalletAddress">use wallet</a>
      <b-input
        ref="contractName"
        v-model="contractName"
        class="mt-3"
        placeholder="Contract Name"></b-input>
      <div v-if="contractFound">
        <b-input v-if="mapName"
          ref="mapName"
          class="mt-3"
          placeholder="Map Name"></b-input>
        <b-input v-if="functionName"
          ref="functionName"
          class="mt-3"
          placeholder="Function Name"></b-input>
      </div>
      <b-row>
        <b-col lg="4" class="pb-2">
          <button size="sm" v-if="contractAddress && contractName" class="mr-2 mt-3 bg-info" @click="lookupContract()">Lookup Contract</button>
          <button size="sm" v-if="contractSource" class="mt-3 bg-info" @click="lookupInterface()">Fetch Interface</button>
        </b-col>
      </b-row>
  </div>
  <div v-if="contractInterface" class="iface-code">
    <interface-explorer :iface="contractInterface"/>
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
import Wallets from '@/components/Wallets'
import InterfaceExplorer from '@/components/contracts/InterfaceExplorer'

export default {
  name: 'Contracts',
  components: {
    Wallets,
    InterfaceExplorer
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
      contractInterface: null,
      response: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    useWalletAddress: function () {
      this.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_CURRENT_ACCOUNT].keyInfo.address
    },
    lookupInterface: function () {
      this.selected = '/v2/contracts/interface/{stacks_address}/{contract_name}'
      const address = this.doSubstitutions()
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      const ep = endpoints.find(item => item.value === this.selected)
      this.response = null
      this.$store.dispatch('fireEvent', { path: address, httpMethod: ep.method, postData: null }).then(response => {
        this.response = response
        this.contractInterface = response
      }).catch((error) => {
        console.log(error)
        this.contractInterface = error
      })
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
      if (this.selected && this.selected.indexOf('contract_id') > -1) {
        address = address.replace('{contract_id}', this.$refs.contractId.$el.value)
      }
      if (this.selected && this.selected.indexOf('contract_name') > -1) {
        address = address.replace('{contract_name}', this.contractName)
      }
      if (this.selected && this.selected.indexOf('map_name') > -1) {
        address = address.replace('{map_name}', this.$refs.mapName.$el.value)
      }
      if (this.selected && this.selected.indexOf('function_name') > -1) {
        address = address.replace('{function_name}', this.$refs.functionName.$el.value)
      }
      if (this.selected && this.selected.indexOf('stacks_address') > -1) {
        address = address.replace('{stacks_address}', this.contractAddress)
      }
      return address
    }
  },
  computed: {
    currentWallet () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_CURRENT_ACCOUNT]
      if (!sender || !sender.keyInfo.address) {
        return false
      }
      return true
    },
    endpoints () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      // endpoints = endpoints.map(item => item.value)
      return endpoints
    },
    contractId () {
      return (this.selected && this.selected.indexOf('contract_id') > -1)
    },
    mapName () {
      return (this.selected && this.selected.indexOf('map_name') > -1)
    },
    functionName () {
      return (this.selected && this.selected.indexOf('function_name') > -1)
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
