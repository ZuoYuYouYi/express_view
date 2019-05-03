<template>
  <div style="height: 100%">
    <view-box ref="ViewBox">
      <loading v-model="isLoading"></loading>
      <div v-transfer-dom>
        <x-dialog v-model="showScrollBox" class="dialog-content">
          <divider>免责声明</divider>
          <div class="content-box">
            <card>
              <div slot="content" class="card-padding">
                <span v-html="statement"></span>
                <divider>
                  <check-icon :value.sync="isConsent">我已阅读并认可以上承诺</check-icon>
                </divider>
              </div>
            </card>

          </div>
          <x-button :disabled="!isConsent" @click.native="showScrollBox = false">同意</x-button>
        </x-dialog>
      </div>
      <router-view></router-view>
      <div style="height: auto"></div>
      <tabbar slot="bottom" v-model="item" @on-index-change="changeValue">
        <tabbar-item :link="{name: 'expressList'}">
          <img slot="icon" :src="expressIcon" alt="快递">
          <span slot="label">快递</span>
        </tabbar-item>
        <tabbar-item :link="{name: 'me'}" :show-dot="isMessage">
          <img slot="icon" :src="meIcon" alt="我的">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  import {
    Group,
    CheckIcon,
    Card,
    Tabbar,
    TabbarItem,
    ViewBox,
    Loading,
    XDialog,
    XButton,
    Divider,
    TransferDomDirective as TransferDom
  } from 'vux'

  import {mapState} from 'vuex'
  import EventBus from '@/EventBus'

  import expressIcon from '@/assets/images/kuaidi_.png'
  import meIcon from '@/assets/images/wode.png'

  const dataJson = require('../src/assets/data')

  export default {
    name: 'App',
    directives: {
      TransferDom
    },
    components: {
      Group,
      CheckIcon,
      Card,
      XDialog,
      XButton,
      Tabbar,
      TabbarItem,
      ViewBox,
      Loading,
      Divider
    },
    data () {
      return {
        expressIcon: expressIcon,
        meIcon: meIcon,
        item: 0,
        showScrollBox: false,
        statement: dataJson.statement,
        isConsent: false
      }
    },
    methods: {
      changeValue () {

      }
    },
    created () {
      this.$http.get('getPrincipal').then(response => {
        if (response.data.status === 200) {
          let user = response.data.data
          // this.$store.dispatch('updateUserAsync', {
          //   user: user
          // })
          this.$store.commit('updateUser', {
            user: user
          })
        }
        if (response.data.status === 500) {
          this.showScrollBox = true
        }

      }).catch(error => {
        this.$vux.toast.text('未知错误' + error, 'middle')
      })
    },
    computed: {
      isMessage () {
        if (this.$store.getters.getUser.username) {
          return !this.$store.getters.getUser.securityuserIsvalid
        }
        return false
      },
      ...mapState({
        isLoading: state => state.vux.isLoading
      })
    },
    mounted () {
      window.onpopstate = () => {
        let allowBack = localStorage.getItem('allowBack')
        if (allowBack === 'false') {
          history.go(1)
        }
      }
      EventBus.$on('appMark', ({item}) => {
        this.$nextTick(() => {
          this.item = item
        })
      })
    }
  }
</script>

<style scoped lang="less">
  @import "~vux/src/styles/reset.less";
  @import '~vux/src/styles/close';

  .dialog-content {

    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }

    .content-box {
      height: 360px;
      padding: 15px 0;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }

  }

  .card-padding {
    padding: 10px;
    text-align: left;
    line-height: 1.6;
    size: A4;
  }
</style>
