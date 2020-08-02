<template>
<div>
  <div class="container">
    <h4>Smart Contracts API</h4>
    <b-form>
      <label class="mb-2 sr-only" for="inline-form-input-name">Principal / Contract</label>
      <b-form-select v-model="selected" :options="endpoints"></b-form-select>
      <b-input v-if="contractId"
        ref="contractId"
        class="mt-3"
        placeholder="contract id"></b-input>
      <b-input v-if="stacksAddress"
        ref="stacksAddress"
        class="mt-3"
        placeholder="Stacks Address"></b-input>
      <b-input v-if="contractName"
        ref="contractName"
        class="mt-3"
        placeholder="Contract Name"></b-input>
      <b-input v-if="mapName"
        ref="mapName"
        class="mt-3"
        placeholder="Map Name"></b-input>
      <b-input v-if="functionName"
        ref="functionName"
        class="mt-3"
        placeholder="Function Name"></b-input>
      <b-button v-if="selected" class="mt-3 btn-sm bg-info" @click="meshEvent(selected)">{{buttonLabel()}}</b-button>
    </b-form>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SmartContracts',
  components: {
  },
  props: ['lookAndFeel'],
  data () {
    return {
      loading: true,
      selected: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    meshEvent: function () {
      if (this.selected && this.selected.length > 0) {
        const address = this.doSubstitutions()
        const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
        const ep = endpoints.find(item => item.value === this.selected)
        this.$emit('meshEvent', { path: address, httpMethod: ep.method, postData: null })
      }
    },
    doSubstitutions: function () {
      let address = this.selected
      if (this.selected && this.selected.indexOf('contract_id') > -1) {
        address = address.replace('{contract_id}', this.$refs.contractId.$el.value)
      }
      if (this.selected && this.selected.indexOf('contract_name') > -1) {
        address = address.replace('{contract_name}', this.$refs.contractName.$el.value)
      }
      if (this.selected && this.selected.indexOf('map_name') > -1) {
        address = address.replace('{map_name}', this.$refs.mapName.$el.value)
      }
      if (this.selected && this.selected.indexOf('function_name') > -1) {
        address = address.replace('{function_name}', this.$refs.functionName.$el.value)
      }
      if (this.selected && this.selected.indexOf('stacks_address') > -1) {
        address = address.replace('{stacks_address}', this.$refs.stacksAddress.$el.value)
      }
      return address
    },
    buttonLabel () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      const current = endpoints.find(item => item.value === this.selected)
      return (current && current.method) ? current.method : 'get'
    }
  },
  computed: {
    endpoints () {
      let endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('contract')
      endpoints = endpoints.map(item => item.value)
      return endpoints
    },
    contractId () {
      return (this.selected && this.selected.indexOf('contract_id') > -1)
    },
    contractName () {
      return (this.selected && this.selected.indexOf('contract_name') > -1)
    },
    mapName () {
      return (this.selected && this.selected.indexOf('map_name') > -1)
    },
    functionName () {
      return (this.selected && this.selected.indexOf('function_name') > -1)
    },
    stacksAddress () {
      return (this.selected && this.selected.indexOf('stacks_address') > -1)
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  text-transform: uppercase;
}
</style>
