<template>
  <div>
    <div>
      <form-preview header-label="悬赏金额" header-value="¥20.00" :body-items="list1"
                    :footer-buttons="buttons1" name="hello"></form-preview>
      <divider></divider>
      <form-preview header-label="悬赏金额" header-value="¥15.00" :body-items="list2"
                    :footer-buttons="buttons2" name="hello"></form-preview>
    </div>
    <div class="space"></div>
    <div v-transfer-dom>
      <popup v-model="isShow" :hide-on-blur=true>
        <div class="popup">
          <divider>评价该服务</divider>
          <group>
            <cell title="打分">
              <rater v-model="start" :max="5" active-color="#04BE02"></rater>
            </cell>
          </group>
          <divider></divider>
          <divider>您为改用户打分{{ start }}分 （满分为5分）</divider>
          <divider></divider>
          <div>
            <x-button class="x_button" plain type="primary" @click.native="close">确定</x-button>
          </div>
          <divider></divider>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {
    FormPreview,
    Divider,
    TransferDom,
    Popup,
    XButton,
    Rater,
    Group,
    Cell
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'evaluate',
    directives: {
      TransferDom
    },
    components: {
      FormPreview,
      Divider,
      Popup,
      XButton,
      Rater,
      Group,
      Cell
    },
    data () {
      return {
        isShow: false,
        start: 0.00,
        list1: [{
          label: '快递名称',
          value: '顺丰快递'
        }, {
          label: '送达地点',
          value: '5号宿舍楼314宿舍'
        }, {
          label: '代领者手机',
          value: '13203902193'
        }],
        buttons1: [{
          style: 'primary',
          text: '点击评价',
          onButtonClick: (name) => {
            this.isShow = true
          }
        }],
        list2: [{
          label: '快递名称',
          value: '申通快递'
        }, {
          label: '送达地点',
          value: '1号宿舍楼112宿舍'
        }, {
          label: '代领者手机',
          value: '13203902193'
        }],
        buttons2: [{
          style: 'default',
          text: '已评价'
        }]
      }
    },
    methods: {
      close () {
        this.isShow = false
      }
    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
    },
    mounted () {
      if (window.history && window.history.pushState) {
        window.addEventListener('popstate', this.close, false)
      }
    },
    destroyed () {
      window.removeEventListener('popstate', this.close, false)
    }
  }
</script>

<style scoped>
  .popup {
    padding-bottom: 15px;
    height: auto;
  }

  .x_button {
    width: 88%;
  }
</style>
