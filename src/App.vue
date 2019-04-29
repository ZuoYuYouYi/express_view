<template>
  <div style="height: 100%">
    <view-box ref="ViewBox">
      <loading v-model="isLoading"></loading>
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
    Tabbar,
    TabbarItem,
    ViewBox,
    Loading
  } from 'vux'

  import {mapState} from 'vuex'
  import EventBus from '@/EventBus'

  import expressIcon from '@/assets/images/kuaidi_.png'
  import meIcon from '@/assets/images/wode.png'

  export default {
    name: 'App',
    components: {
      Tabbar,
      TabbarItem,
      ViewBox,
      Loading
    },
    data () {
      return {
        expressIcon: expressIcon,
        meIcon: meIcon,
        item: 0
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


</style>
