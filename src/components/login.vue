<template>
  <div>
    <divider style="font-size: x-large">
      <span>登录</span>
    </divider>
    <group>
      <x-input title="手机号" v-model="loginMobileNumber" placeholder="请输入手机号" novalidate
               :show-clear="true" @on-blur="loginPhoneReg" style="height: 24px; font-size: small"
               mask="999 9999 9999" :max="13" is-type="china-mobile"
               text-align="center" placeholder-align="center" :icon-type="loginIconType">
        <img slot="label" style="padding-right:10px;display:block;" :src="phoneIcon" width="24"
             height="24" alt="手机号码">
      </x-input>
    </group>
    <group>
      <x-input title="密码" v-model="loginPassWord" placeholder="请输入密码" novalidate
               :show-clear="true" type="password" style="height: 24px; font-size: small"
               text-align="center" placeholder-align="center">
        <img slot="label" style="padding-right:10px;display:block;" :src="passWordIcon" width="24"
             height="24" alt="手机号码">
      </x-input>
    </group>

    <divider style="color: #268BD2"><span @click="toRegister">我还没有账号</span></divider>
    <div>
      <x-button style="font-size: small" @click.native="login" class="x_button" action-type="button" plain type="primary">
        登录
      </x-button>
    </div>
    <div class="space"></div>

  </div>
</template>

<script>
  import phoneIcon from '@/assets/images/phone.png'
  import passWordIcon from '@/assets/images/password.png'
  import {
    XInput,
    Group,
    Divider,
    XButton,
    TransferDom,
    Checker,
    CheckerItem,
    Popup
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'login',
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Group,
      Divider,
      XButton,
      Checker,
      CheckerItem,
      Popup
    },
    data () {
      return {
        loginMobileNumber: '',
        loginPassWord: '',
        loginIconType: '',
        phoneIcon: phoneIcon,
        passWordIcon: passWordIcon,
        passWordIconType: '',
        redirectPath: ''
      }
    },
    methods: {
      toRegister () {
        this.$router.push({name: 'register'})
      },
      clear () {
        this.loginMobileNumber = ''
        this.loginPassWord = ''
      },

      // 手机号码检验
      loginPhoneReg () {
        let phoneNumberReg = /^[1][3-9][0-9]{9}$/
        let phoneNumber = this.loginMobileNumber.replace(/\s*/g, '')
        if (phoneNumberReg.test(phoneNumber)) {
          this.loginIconType = 'success'
        } else {
          this.loginIconType = 'error'
        }
      },

      // 登录
      login () {
        let data = new FormData()
        data.append('userName', this.loginMobileNumber)
        data.append('passWord', this.loginPassWord)
        data.append('rememberMe', 'true')
        this.$http.post('login', data).then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.$http.get('getPrincipal').then(response => {
              let user = response.data.data
              this.$store.commit('updateUser', {
                user: user
              })
              this.$vux.loading.show({
                text: '跳转中...'
              })
              if (this.redirectPath) {
                setTimeout(() => {
                  this.$router.push({path: this.redirectPath})
                  this.$vux.loading.hide()
                }, 1000)
              } else {
                setTimeout(() => {
                  this.$router.push({name: 'me'})
                  this.$vux.loading.hide()
                }, 1000)
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
      this.redirectPath = this.$route.params.redirectPath
    },
    destroyed () {
      this.clear()
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close';

  .x_button {
    width: 88%;
  }


</style>
