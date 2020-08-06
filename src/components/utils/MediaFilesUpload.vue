<template>
<div class="m-0">
  <div class="" v-if="!readonly">
    <div >
      <label class="btn btn-default btn-file text-white" :class="(checkQuantity) ? 'bg-info' : 'bg-warning'" style="cursor: pointer; width: 300px;">
        {{contentModel.title}} <input v-if="checkQuantity" type="file" style="display: none;" id="file-input" @change.prevent="loadMediaObjects"/>
      </label>
    </div>
    <div class="invalid-feedback d-block" v-if="showError">
      {{contentModel.errorMessage}}
    </div>
    <div class="invalid-feedback d-block" v-if="parentalError">
      {{parentalError}}
    </div>
    <div class="invalid-feedback d-block" v-if="internalError">
      {{internalError}}
    </div>
  </div>
  <p v-if="!readonly && contentModel.qualityMessage" v-html="contentModel.qualityMessage"></p>
  <div class="row" v-if="showFiles">
    <div class="col-md-3 mx-0 mb-3" sm="12" v-for="(file, index) in mediaObjects" :key="index" :file="file">
      <div class="">
        <div v-if="!readonly" class="d-flex pr-1 justify-content-between teal-text" style="height: auto;">
          <a style="border-radius: 15px;" href="" @click.prevent="clearMediaObject(file.size)"><i class="fas fa-times text-danger" style="font-size: 1.2rem;"></i></a>
        </div>
        <div class="view view-cascade overlay" v-if="ispdf(file)">
          <img class="card-img-top" :src="missing" :alt="file.name" :title="file.name" height="100px">
          <a href="#!">
            <div class="mask rgba-white-slight waves-effect waves-light"></div>
          </a>
        </div>
        <div class="view view-cascade overlay" v-else-if="isImage(file)">
          <img class="card-img-top" :src="file.dataUrl" :alt="file.name" :title="file.name + ' - ' + fileSizeM(file.size) + ' MB'"  height="100px">
          <a href="#!">
            <div class="mask rgba-white-slight waves-effect waves-light"></div>
          </a>
        </div>
        <div class="card-img-top" id="video-demo-container" v-else-if="isVideo(file)">
            <!-- <video id="video1" controls style="max-height: 250px;" @loadedmetadata="cover"> -->
            <video id="video1" controls style="max-height: 250px;">
                <source type="video/mp4" :src="file.dataUrl">
            </video>
        </div>
        <div class="card-body" id="video-demo-container" v-else-if="isAudio(file)">
          <figure>
            <figcaption>{{file.name}}</figcaption>
            <audio controls :src="file.dataUrl">
              Your browser does not support the <code>audio</code> element.
            </audio>
          </figure>
        </div>
        <!--
        <div class="card-body">
          <div class="card-text"><strong><small>{{file.name}}</small></strong></div>
          <div class="card-text"><strong><small>{{fileSizeM(file.size)}} MB</small></strong></div>
        </div>
        -->
      </div>
    </div>
  </div>

</div>
<!--/droppable area 1 -->
</template>

<script>
import _ from 'lodash'

export default {
  name: 'MediaFilesUpload',
  components: {
  },
  props: {
    showError: {
      type: Boolean,
      default: () => (false),
      required: false
    },
    readonly: {
      type: Boolean,
      default: () => (false),
      required: false
    },
    sizeLimit: {
      type: Number,
      default: () => (450),
      required: true
    },
    parentalError: {
      type: String,
      default: () => (''),
      required: false
    },
    mediaTypes: {
      type: String,
      default: () => ('image'),
      required: false
    },
    limit: {
      type: Number,
      default: () => (2),
      required: true
    },
    contentModel: {
      type: Object,
      default: () => ({}),
      required: true
    },
    showFiles: {
      type: Boolean,
      default: () => (true),
      required: true
    },
    mediaFiles: {
      type: Array,
      default: () => ([]),
      required: false
    },
    popoverId: null
  },
  data () {
    return {
      mediaObjects: [],
      internalError: null,
      missing: '/img/pdf-holding.png'
    }
  },
  created () {
    if (this.mediaFiles && this.mediaFiles.length > 0) {
      Object.assign(this.mediaObjects, this.mediaFiles)
    }
  },
  computed: {
    checkQuantity: function () {
      return this.mediaObjects.length < Number(this.limit)
    },
    columns  () {
      return 'col-' + this.size
    },
    hasMedia () {
      return this.mediaFiles && this.mediaFiles.length > 0
    }
  },
  methods: {
    clearMediaObject: function (fsize) {
      const index = _.findIndex(this.mediaObjects, function (mo) {
        return mo.size === fsize
      })
      this.mediaObjects.splice(index, 1)
      this.$emit('updateMedia', { media: this.mediaObjects })
    },
    clearMediaObjects: function () {
      this.mediaObjects = []
      this.$emit('updateMedia', { media: this.mediaObjects })
    },
    fileSizeM: function (fsize) {
      return fsize / 1000000
    },
    fileType: function (ftype) {
      if (ftype && ftype.startsWith('image')) {
        return ftype.substring(6)
      }
      return ftype
    },
    cover: function (switcher) {
      if (!switcher) {
        return
      }
      const vid = document.querySelector('#video1')
      const cvs = document.querySelector('#canvas1')
      cvs.width = vid.clientWidth
      cvs.height = vid.clientHeight
      const cvsCtx = cvs.getContext('2d')
      vid.currentTime = 0
      const $self = this
      document.querySelector('#video1').addEventListener('timeupdate', function () {
        // You are now ready to grab the thumbnail from the <canvas> element
        cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        const coverImage = {
          dataUrl: cvs.toDataURL(),
          type: 'image/cover'
        }
        $self.$emit('updateMedia', { media: $self.mediaObjects, coverImage: coverImage })
      })
      // cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height)
    },
    ispdf (file) {
      try {
        return file.type.indexOf('pdf') > -1
      } catch (err) {
        return false
      }
    },
    isPlain (file) {
      try {
        const plain = file.type.indexOf('plain') > -1 || file.type.length === 0
        return plain
      } catch (err) {
        return false
      }
    },
    isImage (file) {
      try {
        const image = file.type.indexOf('img') > -1 ||
              file.type.indexOf('image') > -1 ||
              file.type.indexOf('png') > -1 ||
              file.type.indexOf('jpeg') > -1 ||
              file.type.indexOf('jpg') > -1 ||
              file.type.indexOf('gif') > -1
        return image
      } catch (err) {
        return false
      }
    },
    isVideo (file) {
      try {
        const image = file.type.indexOf('video') > -1
        return image
      } catch (err) {
        return false
      }
    },
    isAudio (file) {
      try {
        const image = file.type.indexOf('audio') > -1
        return image
      } catch (err) {
        return false
      }
    },
    isMusic (file) {
      try {
        const image = file.type.indexOf('mp3') > -1
        return image
      } catch (err) {
        return false
      }
    },
    loadMediaObjects: function (e) {
      this.load(e, this.mediaObjects, 1)
    },
    load: function (e, arrayToLoad, limit) {
      const $self = this
      this.internalError = null
      let userFiles
      if (e.dataTransfer) {
        userFiles = e.dataTransfer.files
      } else {
        userFiles = e.target.files
      }
      let fileObject = null
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break
        }
        fileObject = userFiles[i]
        const thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        }
        const ksize = fileObject.size / 1000
        if (ksize > Number(this.sizeLimit)) {
          this.internalError = 'This file (' + ksize + ' Kb) exceeds the size limit of ' + this.sizeLimit + ' Kb'
          return
        }
        let allowed = false
        if ($self.mediaTypes.indexOf('image') > -1) {
          allowed = $self.isImage(fileObject)
        }
        if ($self.mediaTypes.indexOf('plain') > -1) {
          allowed = $self.isPlain(fileObject)
        }
        if ($self.mediaTypes.indexOf('video') > -1) {
          allowed = allowed || $self.isVideo(fileObject)
        }
        if ($self.mediaTypes.indexOf('audio') > -1) {
          allowed = allowed || $self.isAudio(fileObject)
        }
        if ($self.mediaTypes.indexOf('doc') > -1) {
          allowed = allowed || $self.ispdf(fileObject)
        }
        if (!allowed) {
          $self.internalError = 'Files of type ' + fileObject.type + ' are not allowed here.'
          return
        }
        const reader = new FileReader()
        reader.onload = function (e) {
          thisFile.dataUrl = e.target.result
          arrayToLoad.push(thisFile)
          $self.$emit('updateMedia', { media: arrayToLoad })
          if ($self.isVideo(thisFile)) {
            // On selecting a video file
            // document.querySelector('#video-element source').setAttribute('src', URL.createObjectURL(document.querySelector('#file-input').thisFile))
          }
        }
        reader.readAsDataURL(fileObject)
      }
    }
  }
}
</script>
<style scoped>
.drop-area {
  width: 100%;
  border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-label {
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  margin-bottom: 0;
}
select {
  padding: 0px 10px;
}
</style>
