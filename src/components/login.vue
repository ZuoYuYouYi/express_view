<template>
  <div>
    <divider style="font-size: 60px">
      <span>登录</span>
    </divider>
    <group>
      <x-input title="手机号" v-model="loginMobileNumber" placeholder="请输入手机号" novalidate
               :show-clear="true" @on-blur="loginPhoneReg"
               mask="999 9999 9999" :max="13" is-type="china-mobile"
               text-align="center" placeholder-align="center" :icon-type="loginIconType">
        <img slot="label" style="padding-right:10px;display:block;" :src="phoneIcon" width="24"
             height="24" alt="手机号码">
      </x-input>
    </group>
    <group>
      <x-input title="密码" v-model="loginPassWord" placeholder="请输入密码" novalidate
               :show-clear="true" type="password"
               text-align="center" placeholder-align="center">
        <img slot="label" style="padding-right:10px;display:block;" :src="passWordIcon" width="24"
             height="24" alt="手机号码">
      </x-input>
    </group>

    <divider style="color: #268BD2"><span @click="isShow = true">我还没有账号</span></divider>
    <div>
      <x-button @click.native="login" class="x_button" action-type="button" plain type="primary">
        登录
      </x-button>
    </div>
    <div class="space"></div>
    <div v-transfer-dom>
      <popup v-model="isShow" position="left" width="100%" style="background-color: #FFFFFF">
        <div class="position-horizontal">
          <divider style="font-size: 60px">
            <span>注册</span>
          </divider>
          <group>
            <x-input title="手机号" v-model="registerMobileNumber" placeholder="请输入手机号" novalidate
                     :show-clear="true" @on-blur="registerPhoneReg"
                     mask="999 9999 9999" :max="13" is-type="china-mobile"
                     text-align="center" placeholder-align="center" :icon-type="registerIconType">
              <img slot="label" style="padding-right:10px;display:block;" :src="phoneIcon"
                   width="24"
                   height="24" alt="手机号码">
            </x-input>
          </group>
          <group title="选择您的性别">
            <checker v-model="registerSex" default-item-class="checker-item"
                     selected-item-class="checker-item-selected" :radio-required="true">
              <checker-item value="男" class="checker-style">男</checker-item>
              <checker-item value="女" class="checker-style">女</checker-item>
            </checker>
          </group>
          <group>
            <x-input title="密码" v-model="registerPassWord" placeholder="请输入密码" novalidate
                     :show-clear="true" type="password"
                     text-align="center" placeholder-align="center">
              <img slot="label" style="padding-right:10px;display:block;" :src="passWordIcon"
                   width="24"
                   height="24" alt="密码">
            </x-input>
            <x-input title="确认密码" v-model="registerToPassWord" placeholder="请再次确认密码" novalidate
                     :show-clear="true" type="password" text-align="center"
                     placeholder-align="center" @on-blur="passWordPhoneReg"
                     :equal-with="registerPassWord" :icon-type="passWordIconType">
              <img slot="label" style="padding-right:10px;display:block;" :src="passWordIcon"
                   width="24"
                   height="24" alt="密码">
            </x-input>
          </group>

          <group>
            <x-input v-model="registerVerification" title="验证码" placeholder="请输入验证码 " novalidate
                     :show-clear="true" text-align="center" placeholder-align="right"
                     style="height: 36px">
              <img slot="label" style="padding-right:10px;display:block;" :src="verificationIcon"
                   width="24"
                   height="24" alt="手机号码">
              <x-button slot="right" type="primary">发送验证码</x-button>
            </x-input>
          </group>
          <divider></divider>
          <div>
            <x-button @click.native="register" class="x_button" action-type="button" plain
                      type="primary">注册
            </x-button>
          </div>
          <divider>-</divider>
          <span class="vux-close" @click="isShow = false"></span>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import phoneIcon from '@/assets/images/phone.png'
  import passWordIcon from '@/assets/images/password.png'
  import verificationIcon from '@/assets/images/verification.png'
  import {
    Confirm,
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
      Confirm,
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
        registerMobileNumber: '',
        registerIconType: '',
        registerPassWord: '',
        registerSex: '',
        registerToPassWord: '',
        registerVerification: '',
        phoneIcon: phoneIcon,
        passWordIcon: passWordIcon,
        verificationIcon: verificationIcon,
        isShow: false,
        passWordIconType: '',
        redirectPath: ''
      }
    },
    methods: {
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
      registerPhoneReg () {
        let phoneNumberReg = /^[1][3-9][0-9]{9}$/
        let phoneNumber = this.registerMobileNumber.replace(/\s*/g, '')
        if (phoneNumberReg.test(phoneNumber)) {
          this.registerIconType = 'success'
        } else {
          this.registerIconType = 'error'
        }
      },
      // 密码检验
      passWordPhoneReg () {
        if (this.registerPassWord === this.registerToPassWord) {
          this.passWordIconType = 'success'
        } else {
          this.passWordIconType = 'error'
        }
      },
      // 注册
      register () {
        if (this.registerIconType !== 'success' || this.registerPassWord === ''
          || this.registerVerification === '' || this.passWordIconType !== 'success'
          || this.registerSex === '') {
          this.$vux.toast.text('格式不规范,请检查', 'middle')
          return
        }
        let data = new FormData()
        data.append('securityuserPhone', this.registerMobileNumber)
        data.append('securityuserPassword', this.registerPassWord)
        data.append('securityuserSex', this.registerSex)
        data.append('registerVerification', this.registerVerification)
        this.$http.post('register', data).then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.isShow = false
            this.clearRegisterMessage()
          }
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
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
      },
      clearRegisterMessage () {
        this.registerMobileNumber = ''
        this.registerIconType = ''
        this.registerPassWord = ''
        this.registerToPassWord = ''
        this.registerVerification = ''
        this.registerSex = ''
      },
    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
      this.redirectPath = this.$route.params.redirectPath
    },
    destroyed () {
      this.clearRegisterMessage()
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close';

  .x_button {
    width: 88%;
  }

  .position-horizontal {
    position: relative;
    height: 80%;

    .vux-close {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(2);
    }
  }

  .checker-item {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
  }

  .checker-item-selected {
    border-color: green;
  }

  .checker-style {
    margin-left: 26%;
  }
</style>
