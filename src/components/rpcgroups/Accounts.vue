<template>
<div>
  <div class="container">
    <h4>Account API</h4>
    <b-form>
      <label class="mb-2 sr-only" for="inline-form-input-name">Principal / Contract</label>
      <b-form-select v-model="selected" :options="endpoints"></b-form-select>
      <b-input v-if="selected"
        ref="sub1"
        class="mt-3"
        placeholder="Principal ( address )"></b-input>
      <b-button v-if="selected" class="mt-3 btn-sm bg-info" @click="meshEvent(selected)">{{buttonLabel()}}</b-button>
    </b-form>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ApiFramework',
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
        const address = this.getAddress()
        const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('account')
        const ep = endpoints.find(item => item.value === this.selected)
        this.$emit('meshEvent', { path: address, httpMethod: ep.method, postData: null })
      }
    },
    getAddress: function () {
      let address = this.selected
      if (this.selected && this.selected.length > 0 && this.selected.indexOf('{') > -1) {
        const sub1 = this.$refs.sub1.$el.value
        if (!sub1 || sub1.length === 0) {
          this.$notify({ type: 'success', title: 'Stacks Address', text: 'The address or principal (stacks address) is required!' })
          return
        }
        address = this.selected.replace('{address}', sub1)
      }
      return address
    },
    buttonLabel () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('account')
      const current = endpoints.find(item => item.value === this.selected)
      return (current && current.method) ? current.method : 'get'
    }
  },
  computed: {
    endpoints () {
      let endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('account')
      endpoints = endpoints.map(item => item.value)
      return endpoints
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
