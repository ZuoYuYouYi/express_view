<template>
  <div>
    <divider style="font-size: x-large">修改通知手机号</divider>
    <group title="当前通知手机号" style="font-size: small">
      <x-input title="手机号" v-model="nowMobileNumber" novalidate disabled
               style="height: 24px; font-size: small"
               mask="999 9999 9999" :max="13" is-type="china-mobile" text-align="center">
        <img slot="label" style="padding-right:10px;display:block;" :src="phoneIcon" width="24"
             height="24" alt="手机号码">
      </x-input>
    </group>
    <divider></divider>
    <group title="修改通知手机号">
      <x-input title="手机号" v-model="updateMobileNumber" placeholder="请输入手机号" novalidate
               :show-clear="true" @on-blur="updatePhoneReg" style="height: 24px;  font-size: small"
               mask="999 9999 9999" :max="13" is-type="china-mobile"
               text-align="center" placeholder-align="center" :icon-type="updateIconType">
        <img slot="label" style="padding-right:10px;display:block;" :src="phoneIcon"
             width="24"
             height="24" alt="手机号码">
      </x-input>
      <x-input v-model="updateVerification" title="验证码" placeholder="请输入验证码 " novalidate
               :show-clear="true" text-align="center" placeholder-align="center"
               style="height: 24px; font-size: small">
        <img slot="label" style="padding-right:10px;display:block;" :src="verificationIcon"
             width="24"
             height="24" alt="手机号码">
        <x-button slot="right" type="primary" style="font-size: small" :disabled="isSendMessage"
                  @click.native="sendMessage"> {{ buttonText }}
        </x-button>
      </x-input>
    </group>
    <divider></divider>
    <divider>更改手机号后需重新登录（使用新的手机号）</divider>
    <divider></divider>
    <div>
      <x-button @click.native="updatePhone" class="x_button" action-type="button" plain
                type="primary" style="font-size: small">确认修改
      </x-button>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
  import phoneIcon from '@/assets/images/phone.png'
  import verificationIcon from '@/assets/images/verification.png'
  import {
    XInput,
    Group,
    Divider,
    XButton
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'information',
    components: {
      XInput,
      Group,
      Divider,
      XButton
    },
    data () {
      return {
        phoneIcon: phoneIcon,
        verificationIcon: verificationIcon,
        nowMobileNumber: '',
        updateMobileNumber: '',
        updateIconType: '',
        updateVerification: '',
        isSendMessage: false,
        buttonText: '发送验证码'
      }
    },
    computed: {},
    methods: {
      clearMessage () {
        this.updateMobileNumber = ''
        this.updateVerification = ''
      },
      sendMessage () {
        this.$http.get('sendUpdatePhoneMessage/' + this.updateMobileNumber).then(response=>{
          this.$vux.toast.text(response.data.message, 'middle')
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
        this.isSendMessage = true
        const _this = this // 声明一个变量指向Vue实例this，保证作用域一致
        let time = 60
        const timer = setInterval(() => {
          _this.buttonText = time + '\ts'
          time--
          if (time < 0) {
            _this.buttonText = '发送验证码'
            _this.isSendMessage = false
            clearInterval(timer)
          }
        }, 1000)
      },
      updatePhoneReg () {
        let phoneNumberReg = /^[1][3-9][0-9]{9}$/
        let phoneNumber = this.updateMobileNumber.replace(/\s*/g, '')
        if (phoneNumberReg.test(phoneNumber)) {
          this.updateIconType = 'success'
        } else {
          this.updateIconType = 'error'
        }
      },
      updatePhone () {
        let data = new FormData()
        data.append('updateMobileNumber', this.updateMobileNumber)
        data.append('userName', this.$store.getters.getUser.username)
        data.append('updateVerification', this.updateVerification)
        this.$http.post('updatePhone', data).then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.$http.get('logout').then(response => {
              if (response.data.status === 200) {
                this.$router.push({name: 'me'})
                this.clearMessage()
                this.$store.commit('updateUser', {
                  user: {}
                })
                this.$vux.toast.text('修改成功，请重新登录', 'middle')
              }
            }).catch(error => {
              this.$vux.toast.text('未知错误' + error, 'middle')
            })
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
      let user = this.$store.getters.getUser.username
      if (user) {
        this.nowMobileNumber = user
        return
      }
      this.nowMobileNumber = '未登录'
    },
    destroyed () {
      this.clearMessage()
    }
  }
</script>

<style scoped>
  .x_button {
    width: 88%;
  }
</style>
