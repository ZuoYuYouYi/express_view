<template>
  <div style="height:44px;">
    <sticky
      scroll-box="vux_view_box_body"
      ref="sticky"
      :check-sticky-support="false"
    >
      <tab v-model="item" :line-width="1" class="x_tab">
        <tab-item @on-item-click="markShow" :selected="isSelected">快递列表</tab-item>
        <tab-item @on-item-click="markShow" :selected="!isSelected">我有快递</tab-item>
      </tab>
    </sticky>
    <router-view></router-view>
    <div style="height: auto"></div>
  </div>
</template>

<script>
  export default {
    name: 'express',
    components: {
      Tab,
      TabItem,
      Sticky
    },
    data () {
      return {
        item: 0,
        isSelected: true
      }
    },
    methods: {
      markShow () {
        this.$router.push({
          name: this.item === 0 ? 'expressList' : 'expressIssue'
        })
      },
    },
    created () {
      EventBus.$emit('appMark', {
        item: 0
      })
      this.isSelected = this.$route.meta.isSelected
    },
    watch: {
      '$route.meta.isSelected' () {
        this.isSelected = this.$route.meta.isSelected
      }
    },

    mounted () {
    }
  }
  import {Tab, TabItem, Sticky} from 'vux'

  import EventBus from '@/EventBus'
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';

  .x_tab {
    font-weight: bold;
  }
</style>
