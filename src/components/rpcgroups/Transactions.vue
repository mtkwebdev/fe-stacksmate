<template>
<div>
  <div class="container">
    <h4>Transactions API</h4>
    <b-form>
      <label class="mb-2 sr-only" for="inline-form-input-name">Transactions</label>
      <b-form-select v-model="selected" :options="endpoints"></b-form-select>
      <div class="mt-4">
        <b-input v-if="showInput()"
          ref="sub1"
          class="mt-3"
          placeholder="Transaction ID"
        ></b-input>
      </div>
      <div class="mt-4" v-if="showStream()">
        <div>
          <b-form-group label="Choose the stream type">
            <b-form-radio v-model="streamType" name="some-radios" value="websocket">websocket</b-form-radio>
            <b-form-radio v-model="streamType" name="some-radios" value="eventsource">eventsource</b-form-radio>
          </b-form-group>
        </div>
      </div>
      <div v-if="selected">
        <b-button class="mt-3 btn-sm bg-info" @click="meshEvent(selected)">{{buttonLabel()}}</b-button>
      </div>
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
  watch: {
    'selected' () {
      this.$store.commit('addResponse', null)
    }
  },
  props: ['lookAndFeel'],
  data () {
    return {
      streamType: 'websocket',
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
        const ep = this.endpoints.find(item => item.value === this.selected)
        this.$emit('meshEvent', { path: address, httpMethod: ep.method, postData: null })
      }
    },
    getAddress: function () {
      let address = this.selected
      if (this.selected && this.selected.length > 0 && this.selected.indexOf('{') > -1) {
        if (this.selected.indexOf('stream') === -1) {
          const sub1 = this.$refs.sub1.$el.value
          if (!sub1 || sub1.length === 0) {
            this.$notify({ type: 'success', title: 'Stacks Address', text: 'The address or principal (stacks address) is required!' })
            return
          }
          address = this.selected.replace('{txid}', sub1)
        } else {
          const sub1 = this.streamType
          address = this.selected.replace('{protocol}', sub1)
        }
      }
      return address
    },
    showInput: function () {
      if (this.selected && this.selected.length > 0 && this.selected.indexOf('/sidecar/v1/tx/{txid}') > -1) {
        return true
      }
      return false
    },
    showStream: function () {
      if (this.selected && this.selected.length > 0 && this.selected.indexOf('/sidecar/v1/tx/stream') > -1) {
        return true
      }
      return false
    },
    buttonLabel () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('transaction')
      const current = endpoints.find(item => item.value === this.selected)
      return (current && current.method) ? current.method : 'get'
    }
  },
  computed: {
    endpoints () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('transaction')
      return endpoints
    },
    contents () {
      const file = this.file
      return file
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
