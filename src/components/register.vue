<template>
  <div>
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

    <br/>
    <group>
      <popup-picker :popup-title="'请选择您的学院名称'" :title="'选择学院名称'" :data="userCollegeList"
                    v-model="userCollege" :placeholder="'请选择学院名称'">
        <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="vertical-align:middle;">学院名称</span>
          </span>
        </template>
      </popup-picker>
    </group>
    <br/>
    <group>
      <x-input title="专业" v-model="userSubject" placeholder="请输入您的就读专业" novalidate
               @on-blur="userSubjectInspect"
               text-align="center" placeholder-align="center" :required="true"></x-input>
    </group>
    <br/>
    <group>
      <x-input title="班级" v-model="userClass" placeholder="请输入您的班级" novalidate
               @on-blur="userClassInspect"
               text-align="center" placeholder-align="center" :required="true"></x-input>
    </group>
    <br/>
    <group title="选择您的性别">
      <checker v-model="registerSex" default-item-class="checker-item"
               selected-item-class="checker-item-selected" :radio-required="true">
        <checker-item value="男" class="checker-style">男</checker-item>
        <checker-item value="女" class="checker-style">女</checker-item>
      </checker>
    </group>
    <br/>
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
    <div class="space"></div>
  </div>
</template>

<script>
  import phoneIcon from '@/assets/images/phone.png'
  import passWordIcon from '@/assets/images/password.png'
  import verificationIcon from '@/assets/images/verification.png'

  import {
    PopupPicker,
    Picker,
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

  const dataJson = require('../assets/data')

  export default {
    name: 'register',
    directives: {
      TransferDom
    },
    components: {
      PopupPicker,
      Picker,
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
        userCollege: [],
        userCollegeList: dataJson.userCollegeList,
        userSubject: '',
        userClass: '',
        registerToPassWord: '',
        registerVerification: '',
        phoneIcon: phoneIcon,
        passWordIcon: passWordIcon,
        verificationIcon: verificationIcon,
        passWordIconType: ''
      }
    },
    methods: {
      registerPhoneReg () {
        let phoneNumberReg = /^[1][3-9][0-9]{9}$/
        let phoneNumber = this.registerMobileNumber.replace(/\s*/g, '')
        if (phoneNumberReg.test(phoneNumber)) {
          this.registerIconType = 'success'
        } else {
          this.registerIconType = 'error'
        }
      },
      userSubjectInspect () {
        if (this.userSubject.length > 1 && this.userSubject.length < 8) {
          return
        }
        this.userSubject = ''
        this.$vux.toast.text('专业格式不规范,请检查', 'middle')
      },
      userClassInspect () {
        if (this.userClass.length > 1 && this.userClass.length < 10) {
          return
        }
        this.userClass = ''
        this.$vux.toast.text('班级格式不规范,请检查', 'middle')
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
          || this.registerSex === '' || this.userCollege[0] === '' || this.userSubject === ''
          || this.userClass === '') {
          this.$vux.toast.text('格式不规范,请检查', 'middle')
          return
        }
        let data = new FormData()
        data.append('userCollege', this.userCollege[0])
        data.append('userSubject', this.userSubject)
        data.append('userClass', this.userClass)
        data.append('securityuserPhone', this.registerMobileNumber)
        data.append('securityuserPassword', this.registerPassWord)
        data.append('securityuserSex', this.registerSex)
        data.append('registerVerification', this.registerVerification)
        this.$http.post('register', data).then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.$router.push({name: 'login'})
            this.clearRegisterMessage()
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
        this.userCollege = ''
        this.userSubject = ''
        this.userClass = ''
      },
    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
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
