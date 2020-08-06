<template>
<div>
  <div class="container">
    <b-form >
      <div class="mt-4">
        <div>
          <media-files-upload @lookupEvent="$emit('lookupEvent')" class="mb-3" :readonly="false" :contentModel="contentModel1" popoverId="'popover-target-1'" :parentalError="parentalError" :showFiles="true" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="2000000" :mediaTypes="'plain'" @updateMedia="setByEventLogo1($event)"/>
          <div v-if="uploadable">
            <div class="mb-3">
              <b-input
                id="contractName"
                ref="contractName"
                v-model="fileName"
                class=""
                placeholder="Contract Name"
              ></b-input>
              <b-form-text>
                The contract file name must have a .clar extension and forms part of the contract address on the network.
              </b-form-text>
            </div>

            <div class="mb-3">
              <b-textarea
                ref="contractCode"
                :value="decodedString"
                class="mt-3"
                rows="10"
                placeholder="Contract Code"
              ></b-textarea>
              <b-form-text>
                Your clarity contract to be deployed on the blockchain.
              </b-form-text>
            </div>
            <div class="mt-3">
              <b-button class="mr-3 btn-sm bg-info" @click="deployContract()">Deploy Contract</b-button>
            </div>
            <!-- <pre class="mt-3 mb-0">{{ plainFile }}</pre> -->
          </div>
        </div>
      </div>
    </b-form>
    <div class="container m-5">
      {{result}}
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaFilesUpload from '@/components/utils/MediaFilesUpload'

export default {
  name: 'ContractSourceCode',
  components: {
    MediaFilesUpload
  },
  watch: {
  },
  props: ['lookAndFeel'],
  data () {
    return {
      feeAmount: 3000,
      result: null,
      nonce: 0,
      loading: true,
      parentalError: null,
      contentModel1: {
        title: 'Load Contract Source',
        errorMessage: 'A file is required.',
        popoverBody: 'Your clarity  file.'
      },
      files: []
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    setByEventLogo1 (data) {
      this.files = data.media
    },
    plainFile () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    deployContract: function () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      const filename = this.files[0].name
      const data = {
        contractName: filename.split(/\./)[0],
        codeBody: this.plainFile()
      }
      if (provider === 'blockstack') {
        this.$store.dispatch('authStore/deployContractBlockstack', data)
      } else {
        const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
        data.senderKey = (sender && sender.keyInfo) ? sender.keyInfo.privateKey : null
        if (!data.senderKey) {
          this.result = 'no sender key'
          return
        }
        this.$store.dispatch('authStore/deployContractRisidio', data).then((result) => {
          this.result = result
        }).catch((error) => {
          this.result = error
        })
      }
    }
  },
  computed: {
    fileName () {
      if (this.files.length === 0) {
        return
      }
      const filename = this.files[0].name
      return filename.split(/\./)[0]
    },
    mediaFiles1 () {
      let files = []
      if (this.files.length > 0) {
        files = this.files
      }
      return files
    },
    decodedString () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    endpoints () {
      const endpoints = this.$store.getters[APP_CONSTANTS.KEY_ENDPOINTS]('deployment')
      return endpoints
    },
    validAccount () {
      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!sender || !sender.balance) {
        return false
      }
      return true
    },
    uploadable () {
      // const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      // if (!sender || !sender.balance) {
      //  return false
      // }
      return this.files && this.files.length > 0
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  text-transform: uppercase;
}
</style>
