<template>
  <div>
    <group title="上传照片">
      <el-upload :action="uploadURL" :with-credentials="true" list-type="picture"
                 :on-success="handlePictureCardSuccess" :on-change="changeFile"
                 :on-error="handlePictureCardError" :before-upload="beforeAvatarUpload"
                 :auto-upload="false" :limit="1" :multiple="false" name="file"
                 :disabled="fileListLength !== 0 || isCriteria" ref="upload" accept="image">
        <x-button style="margin-left: 10px;" slot="trigger" class="x_button" action-type="button"
                  mini :disabled="fileListLength !== 0 || isCriteria || user.securityuserIsvalid"
                  type="primary">选择照片
        </x-button>
        <x-button style="margin-left: 10px;" @click.native="clearFile" class="x_button"
                  action-type="button" mini plain :disabled="fileListLength === 0 || isCriteria"
                  type="primary">清除照片
        </x-button>
        <x-button style="margin-left: 10px;" @click.native="submitImg" class="x_button"
                  action-type="button" mini :disabled="fileListLength === 0 || isCriteria"
                  type="warn">确认提交
        </x-button>
        <div slot="tip" class="el-upload__tip">只能上传图片文件，且文件大小不超过3M</div>
      </el-upload>
    </group>

  </div>
</template>

<script>
  import {
    XButton,
    Group,
    Divider
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'criteria',
    components: {
      XButton,
      Group,
      Divider
    },
    data () {
      return {
        uploadURL: this.$http.defaults.baseURL + 'criteriaUser',
        dialogImageURL: '',
        fileListLength: 0,
        isCriteria: false,
        user:{}
      }
    },
    methods: {
      changeFile (file, fileList) {
        this.fileListLength = fileList.length
      },
      beforeAvatarUpload (file) {
        let fileType = file.type.toString()
        let pos = fileType.lastIndexOf('/')
        let fileTypeName = fileType.substring(0, pos)
        if (fileTypeName !== 'image') {
          this.$vux.toast.text('只能上传图片', 'middle')
          return false
        }
        if (file.size > 3145728) {
          this.$vux.toast.text('文件大小不得超过3M', 'middle')
          return false
        }
      },
      clearFile () {
        this.$refs.upload.clearFiles()
      },
      submitImg () {
        this.$refs.upload.submit()
      },
      handlePictureCardSuccess (response) {
        this.isCriteria = true
      },
      handlePictureCardError (err, file, fileList) {
        // console.log('handlePictureCardError', file, err, fileList)
      }
    },
    computed: {

    },
    created () {
      this.user = this.$store.getters.getUser
      EventBus.$emit('appMark', {
        item: 1
      })
    }
  }
</script>

<style scoped>

</style>
