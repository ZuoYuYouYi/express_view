<template>
  <div>
    <x-header :left-options="{showBack: false}">我的快递订单</x-header>
    <div v-if="resultList.length === 0">
      <divider>暂无快递订单数据</divider>
    </div>
    <div v-else>
      <div v-for=" result in resultList">
        <form-preview header-label="悬赏金额" :header-value="result.expressReward"
                      :body-items="result.list" :footer-buttons="result.button"
                      :name="result"></form-preview>
        <divider>
          <hr/>
        </divider>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="isShow" :hide-on-blur=true>
        <div class="popup">
          <divider>举报该代领者</divider>
          <group>
            <x-textarea title="举报原因：" v-model="report" :placeholder="'请输入举报信息（不得低于10个字）'"
                        :show-counter="true"
                        :max="100" autosize></x-textarea>
          </group>
          <x-button :disabled="isDisabled" @click.native="reportUser" class="x_button" type="warn">
            举报
          </x-button>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :close-on-confirm="false"
        title="取消该订单"
        @on-confirm="countermandExpress">
        <p style="text-align:center;">您确定要取消该订单吗？</p>
      </confirm>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
  import Moment from 'moment'
  import {
    Confirm,
    XTextarea,
    Group,
    TransferDom,
    Popup,
    XHeader,
    FormPreview,
    Divider,
    XButton
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'expressIndent',
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XTextarea,
      Group,
      Popup,
      XHeader,
      FormPreview,
      Divider,
      XButton
    },
    data () {
      return {
        userName: '',
        resultList: [],
        isShow: false,
        expressDeliveryuserId: '',
        expressId: '',
        report: '',
        showConfirm: false
      }
    },
    computed: {
      isDisabled () {
        return this.report.length < 10
      }
    },
    methods: {
      formatForPreview (dataList) {
        this.resultList = []
        dataList.forEach((data) => {
            this.resultList.push(
              {
                expressId: data.expressId,
                expressReward: data.expressReward,
                expressStatus: data.expressStatus,
                expressDeliveryuserId: data.expressDeliveryuserId,
                expressReport: data.expressReport,
                list: [
                  {
                    label: '快递名称',
                    value: data.expressName
                  },
                  {
                    label: '发布日期',
                    value: Moment(data.expressDate).format('YYYY-MM-DD HH:mm')
                  },
                  {
                    label: '是否完成',
                    value: data.expressStatus === 2 ? '已完成' : '未完成'
                  },
                  data.expressStatus === 2 ? {
                    label: '完成方式',
                    value: data.expressDeliveryuserId ? '被领取' : '自己取消'
                  } : {}
                ],
                button: [
                  data.expressStatus === 2 ? (data.expressDeliveryuserId && !data.expressReport ? {
                    style: 'primary',
                    text: '举报该代领者',
                    onButtonClick: (name) => {
                      this.expressDeliveryuserId = name.expressDeliveryuserId
                      this.expressId = name.expressId
                      this.isShow = true
                    }
                  } : data.expressDeliveryuserId ? {
                    style: 'default',
                    text: '已举报'
                  } : {}) : {
                    style: 'primary',
                    text: '标记为已完成',
                    onButtonClick: (name) => {
                      this.expressId = name.expressId
                      this.showConfirm = true
                    }
                  },
                ],
              }
            )
          },
        )
      },
      selectExpress () {
        this.$http.get('express/' + this.userName).then(response => {
          let resultList = response.data.data
          if (resultList.length !== 0) {
            this.formatForPreview(resultList.reverse())
          }
          this.formatForPreview(response.data.data)
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      },
      countermandExpress () {
        this.showConfirm = false
        this.$http.delete('express/' + this.expressId).then(
          response => {
            this.$vux.toast.text(response.data.message, 'middle')
            if (response.data.status === 200) {
              this.selectExpress()
            }
          }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
        this.expressId = ''
      },
      reportUser () {
        let data = new FormData()
        data.append('expressDeliveryuserId', this.expressDeliveryuserId)
        data.append('expressId', this.expressId)
        data.append('report', this.report)
        this.$http.post('report', data).then(
          response => {
            this.isShow = false
            this.report = ''
            this.$vux.toast.text(response.data.message, 'middle')
            if (response.data.status === 200) {
              this.selectExpress()
            }
          }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
        this.expressId = ''
        this.expressDeliveryuserId = ''
      }
    },

    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
      this.userName = this.$store.getters.getUser.username
      this.selectExpress()
    }
  }
</script>

<style scoped lang="less">

</style>
