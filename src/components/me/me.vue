<template>
  <div>
    <group>
      <cell title="账户" :is-link="isLink" :disabled="!isLink" style="font-size: 20px"
            :link="{name: 'login'}">
        <img slot="icon" width="60px" style="display:block;margin-right:20px;" :src="userIcon"
             alt="user">
        <span class="vertical-middle" v-text="userName"></span>
      </cell>
      <cell :title="!user.username ? '身份认证（未登录）' : '身份认证'" :disabled="!user.username"
            is-link :link="{name: 'criteria'}" class="cell-height">
        <div class="badge-value" v-if="user.username">
          <span class="vertical-middle" v-text="messageText"></span>
          <badge v-if="messageNum > 0" :text="messageNum"></badge>
        </div>
      </cell>
      <cell :title="!user.username ? '通知手机号（未登录）' : '通知手机号'" :disabled="!user.username"
            is-link :link="{name: 'information'}"
            class="cell-height">
        <div class="badge-value">
        </div>
      </cell>
      <card :header="{title: '我的订单信息'}" style="text-align: center">
        <div slot="content" class="card-message-flex card-message-content">
          <div class="vux-1px-r" @click="toExpressIndent">
            <span>{{ expressCount }}</span>
            <br/>
            快递订单
          </div>
          <div class="vux-1px-r" @click="toDeliveryManIndent">
            <span>{{ deliverymanCount }}</span>
            <br/>
            代领订单
          </div>
        </div>
      </card>
      <cell title="关于我们" is-link :link="{name: 'aboutMe'}" class="cell-height">
        <div class="badge-value">
        </div>
      </cell>
      <cell title="反馈建议" is-link :link="{name: 'suggest'}" class="cell-height">
        <div class="badge-value">
        </div>
      </cell>
      <cell title="版本" class="cell-height">
        <div class="badge-value">
          <span class="vertical-middle">Version 1.0.0</span>
        </div>
      </cell>
    </group>
    <br/>
    <div v-show="!isLink">
      <x-button @click.native="showConfirm = true" class="x_button" action-type="button" plain
                type="warn">
        注销
      </x-button>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :close-on-confirm="false"
        title="账户注销"
        @on-confirm="onConfirm">
        <p style="text-align:center;">确定注销？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import userIcon from '@/assets/images/user.png'
  import {
    XButton,
    Divider,
    Card,
    Badge,
    Group,
    Cell,
    TransferDomDirective as TransferDom,
    Confirm
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'me',
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XButton,
      Card,
      Divider,
      Badge,
      Group,
      Cell
    },
    data () {
      return {
        userIcon: userIcon,
        isLink: true,
        showConfirm: false,
        expressCount: 0,
        deliverymanCount: 0,
        messageText: '',
        messageNum: 0,
        user: {}
      }
    },
    methods: {
      toExpressIndent () {
        if (!this.user.username) {
          this.$vux.toast.text('您还未登录', 'middle')
          return
        }
        if (!this.user.securityuserIsvalid) {
          this.$vux.toast.text('您还未经过实名审核', 'middle')
          return
        }
        this.$router.push({name: 'expressIndent'})
      },
      toDeliveryManIndent () {
        if (!this.user.username) {
          this.$vux.toast.text('你还未登录', 'middle')
          return
        }
        if (!this.user.securityuserIsvalid) {
          this.$vux.toast.text('您还未经过实名审核', 'middle')
          return
        }
        this.$router.push({name: 'deliverymanIndent'})
      },
      logout () {
        this.$http.get('logout').then(response => {
          this.$vux.toast.text(response.data.message, 'middle')
          if (response.data.status === 200) {
            this.user = {}
            this.userName = '未登录'
            this.expressCount = 0
            this.deliverymanCount = 0
            this.$store.commit('updateUser', {
              user: {}
            })
          }
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      },
      onConfirm () {
        this.$vux.loading.show({
          text: '注销中...'
        })
        setTimeout(() => {
          this.logout()
          this.$vux.loading.hide()
          this.showConfirm = false
        }, 1000)
      },
    },
    computed: {
      userName: {
        get () {
          let user = this.$store.getters.getUser.username
          if (!user) {
            this.isLink = true
            return '未登录'
          }
          this.isLink = false
          return user
        },
        set (newValue) {

        }
      }

    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
      this.user = this.$store.getters.getUser
      let username = this.user.username
      if (username) {
        let isValid = this.$store.getters.getUser.securityuserIsvalid
        this.messageNum = isValid ? 0 : 1
        this.messageText = !isValid ? '请您进行实名审核' : '您已完成实名审核'
        this.$http.get('express/count/' + username).then(response => {
          if (response.data.status !== 200) {
            this.expressCount = 0
            this.deliverymanCount = 0
            return
          }
          this.expressCount = response.data.expressCount
          this.deliverymanCount = response.data.deliverymanCount
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      }

    }

  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';

  .card-message-flex {
    display: flex;
  }

  .card-message-content {
    padding: 10px 0;
  }

  .card-padding {
    padding: 15px;
  }

  .card-message-flex > div {
    flex: 1;
    text-align: center;
    font-size: 18px;
    color: #898989;
  }

  .card-message-flex span {
    color: #f74c31;
  }

  .badge-value {
    display: inline-block !important;
  }

  .cell-height {
    height: 26px;
    line-height: 26px;
  }

  .vertical-middle {
    vertical-align: middle;
  }

  .x_button {
    width: 88%;
  }
</style>
