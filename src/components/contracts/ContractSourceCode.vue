<template>
<div>
  <div class="create-contract">
    <b-form >
        <div>
          <div v-if="!uploadable" class="text-info pt-5 create-container text-center">
            <div>
              <div style="font-size: 32px;">+</div>
              <media-files-upload style="font-size: 16px; cursor: pointer;" class="" @lookupEvent="$emit('lookup-event')" :readonly="false" :contentModel="contentModel1" popoverId="'popover-target-1'" :parentalError="parentalError" :showFiles="true" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="2000000" :mediaTypes="'plain'" @updateMedia="setByEventLogo1($event)"/>
            </div>
          </div>
          <div v-if="uploadable">
            <div>
              <h1>Contract name</h1>
              <div class="mb-3">
                <b-input
                  id="contractName"
                  ref="contractName"
                  v-model="fileName"
                  class="my-input"
                  placeholder="Contract Name"
                ></b-input>
              </div>
              <div class="mb-3">
                <b-textarea
                  ref="contractCode"
                  :value="decodedString"
                  class=" text-info py-4 my-3 my-input"
                  rows="10"
                  placeholder="Contract Code"
                ></b-textarea>
              </div>
              <div class="mt-3 d-flex justify-content-end">
                <b-button variant="outline-info" class="text-white button2" @click="cancelUpload()">Cancel</b-button>
                <b-button variant="info" class="ml-3 text-white button1" @click="deployContract()">Deploy</b-button>
              </div>
            </div>
            <!-- <pre class="mt-3 mb-0">{{ plainFile }}</pre> -->
          </div>
        </div>
    </b-form>
  </div>
  <b-modal scrollable id="modal-1" title="Contract Deployed">
    <div class="row" v-if="txData">
      <div class="col-12 my-1">
        <div class="mb-3">Deployed {{txData.contractName}}</div>
        <div class="mb-3">Tx: {{txData.result}}</div>
      </div>
    </div>
    <template v-slot:modal-footer>
    </template>
  </b-modal>
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
      txData: null,
      nonce: 0,
      loading: true,
      parentalError: null,
      contentModel1: {
        title: 'Browse computer for contract to deploy',
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
    cancelUpload () {
      this.files = []
    },
    deployContract: function () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      const filename = this.files[0].name
      const data = {
        contractName: filename.split(/\./)[0],
        codeBody: this.plainFile()
      }

      const sender = this.$store.getters[APP_CONSTANTS.KEY_TEST_WALLET]
      if (!this.validate(data, provider, sender)) {
        return
      }

      if (provider === 'blockstack') {
        this.$store.dispatch('authStore/deployContractBlockstack', data)
      } else {
        data.senderKey = sender.keyInfo.privateKey
        data.address = sender.keyInfo.address
        this.$store.dispatch('authStore/deployContractRisidio', data).then((txData) => {
          this.txData = txData
          this.$bvModal.show('modal-1')
        }).catch((error) => {
          this.$notify({ type: 'error', title: 'Contracts', text: 'Error during deployment. ', error })
        })
      }
    },
    validate: function (data, provider, sender) {
      let result = true

      if (!data || !data.contractName || !data.codeBody) {
        this.$notify({ type: 'error', title: 'Contracts', text: 'Load the contract source code to continue.' })
        result = false
      }

      if (provider === 'blockstack') {
        return result
      }

      if (!sender) {
        this.$notify({ type: 'error', title: 'Contracts', text: 'Select a test wallet (with enough funds to cover the transaction fee) to continue.' })
        result = false
      } else if (!sender.balance) {
        this.$notify({ type: 'error', title: 'Contracts', text: 'Not enough enough funds to cover the transaction fee.' })
        result = false
      }
      return result
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
    uploadable () {
      return this.files && this.files.length > 0
    }
  }
}
</script>
<style lang="scss" scoped>
.create-container {
  width: 200px;
  height: 200px;
  margin: auto auto;
}
.my-input {
  background: #363636 0% 0% no-repeat padding-box;
  border-radius: 24px;
  border: none;
}
</style>
