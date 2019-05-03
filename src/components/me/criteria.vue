<template>
  <div>
    <group title="审核照片要求" class="card-padding">
      <p>
        1、手持学生证，展示学生证信息一页，放于胸前。
      </p>
      <p>
        2、照片必须清晰，可看清学生证上的字。
      </p>
      <p>
        3、照片只需展示上半身即可，人像需有辨识度。
      </p>
      <p>
        4、审核时间约1～2个工作日。
      </p>
    </group>
    <group title="上传照片">
      <el-upload :action="uploadURL" :with-credentials="true" list-type="picture"
                 :on-success="handlePictureCardSuccess" :on-change="changeFile"
                 :on-error="handlePictureCardError" :before-upload="beforeAvatarUpload"
                 :auto-upload="false" :limit="1" :multiple="false" name="file"
                 :disabled="fileListLength !== 0 || isCriteria" ref="upload" accept="image">
        <x-button style="margin-left: 10px;" slot="trigger" class="x_button" action-type="button"
                  mini
                  :disabled="Object.keys(audit).length === 0 ? false : !audit.auditFlag || fileListLength !== 0 || isCriteria || user.securityuserIsvalid"
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
        <div v-show="fileListLength === 0" class="card-padding" style="font-size: 26px">
          <div v-if="Object.keys(audit).length === 0">
            <divider>您还未进行身份审核</divider>
          </div>
          <div v-else>
            <div v-if="!audit.auditFlag && !user.securityuserIsvalid">
              <divider>您已提交，等待管理员审核中</divider>
              <divider style="font-size: 16px">提交时间：{{audit.auditDate | convertTime}}</divider>
            </div>
            <div v-if="audit.auditFlag && !user.securityuserIsvalid">
              <divider>您提交的审核未通过</divider>
              <divider style="font-size: 16px">审核时间：{{audit.auditDate | convertTime}}</divider>
              <p class="card-padding" style="font-size: 18px">
                原因：{{audit.auditMessage}}，请您按照要求再次提交照片</p>
            </div>
            <div v-if="user.securityuserIsvalid">
              <divider>您已通过身份认证</divider>
              <divider style="font-size: 16px">审核日期：{{audit.auditDate | convertTime}}</divider>
            </div>
          </div>

        </div>
      </el-upload>
    </group>
    <div class="space"></div>
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
        uploadURL: this.$http.defaults.baseURL + 'audit',
        dialogImageURL: '',
        fileListLength: 0,
        isCriteria: false,
        user: {},
        audit: {}
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
          this.clearFile()
          return false
        }
        if (file.size > 3145728) {
          this.$vux.toast.text('文件大小不得超过3M', 'middle')
          this.clearFile()
          return false
        }
      },
      clearFile () {
        this.$refs.upload.clearFiles()
        this.fileListLength = 0
      },
      submitImg () {
        this.$refs.upload.submit()
      },
      handlePictureCardSuccess (response) {
        this.isCriteria = true
        this.$vux.toast.text(response.message, 'middle')
      },
      handlePictureCardError (err, file, fileList) {
        this.$vux.toast.text('未知错误' + err, 'middle')
      }
    },
    computed: {},
    created () {
      this.user = this.$store.getters.getUser
      EventBus.$emit('appMark', {
        item: 1
      })
      this.$http.get('audit/' + this.user.username).then(response => {
        if (response.data.status === 200) {
          if (response.data.data === null) {
            return
          }
          this.audit = response.data.data
        }
      })
    }
  }
</script>

<style scoped>
  .card-padding {
    padding: 12px;
    text-align: left;
    line-height: 1.6;
    size: A4;
  }
</style>
