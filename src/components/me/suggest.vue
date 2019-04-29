<template>
  <div>
    <divider style="font-size: 30px">给我们一些建议或反馈</divider>
    <group title="请写下您的建议或反馈">
      <x-textarea v-model="content" placeholder="请输入您的建议或反馈（最少10个字）"
                  :show-counter="true"
                  :max="300" :height="300"></x-textarea>
    </group>
    <divider></divider>
    <div>
      <x-button :disabled="isDisabled" @click.native="showConfirm = true" class="x_button" plain
                type="primary">
        提交
      </x-button>
    </div>
    <div class="space"></div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :close-on-confirm="false"
        title="提交建议"
        @on-confirm="submitSuggest">
        <p style="text-align:center;">确定提交您的建议吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import {
    XTextarea,
    XButton,
    Toast,
    TransferDomDirective as TransferDom,
    Confirm,
    Divider,
    Group
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'suggest',
    components: {
      XTextarea,
      XButton,
      Toast,
      Confirm,
      Divider,
      Group
    },
    directives: {
      TransferDom
    },
    data () {
      return {
        content: '',
        userName: '',
        showConfirm: false
      }
    },
    computed: {
      isDisabled () {
        return this.content.length < 10
      }
    },
    methods: {
      submitSuggest () {
        this.showConfirm = false
        let data = new FormData()
        data.append('content', this.content)
        data.append('userName', this.userName)
        this.$http.post('suggest', data).then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.$router.push({name: 'me'})
          }
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      }
    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
      this.userName = this.$store.getters.getUser.username
    },
  }
</script>

<style scoped>
  .x_button {
    width: 88%;
  }
</style>
