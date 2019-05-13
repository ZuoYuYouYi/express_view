<template>
  <div>
    <x-header :left-options="{showBack: false}">我的代领订单</x-header>
    <div v-if="resultList.length === 0">
      <divider>暂无代领订单数据</divider>
    </div>
    <div v-else>
      <div v-for=" result in resultList">
        <form-preview header-label="报酬金额" :header-value="result.expressReward"
                      :body-items="result.list" :footer-buttons="result.button"
                      :name="result.expressId"></form-preview>
        <divider>
          <hr/>
        </divider>
      </div>
    </div>
    <div class="space"></div>
    <div v-transfer-dom>
      <popup v-model="isShow" :hide-on-blur=true>
        <div class="popup">
          <divider>快递详情</divider>
          <x-table :content-bordered="true"
                   :full-bordered="true"
                   :cell-bordered="true"
                   class="x_table">
            <tr>
              <th class="x_thead">
                <strong>快递名称</strong>
              </th>
              <td>
                {{ express.expressName }}
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>送达地点</strong>
              </th>
              <td>
                {{ express.expressGoalAddress }}
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>快递地址</strong>
              </th>
              <td>
                {{ express.expressAddress }}
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>发布时间</strong>
              </th>
              <td>
                {{ express.expressDate | convertTime }}
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>赏金</strong>
              </th>
              <td>
                {{ express.expressReward }}&nbsp;元
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>快递重量</strong>
              </th>
              <td>
                {{ express.expressWeight }}
              </td>
            </tr>
            <tr>
              <th class="x_thead">
                <strong>备注</strong>
              </th>
              <td>
                {{ express.expressRemark }}
              </td>
            </tr>
          </x-table>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {
    XHeader,
    TransferDom,
    XTable,
    Popup,
    FormPreview,
    Divider,
    XButton
  } from 'vux'
  import Moment from 'moment'
  import EventBus from '@/EventBus'

  export default {
    name: 'deliverymanIndent',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTable,
      Popup,
      FormPreview,
      Divider,
      XButton
    },
    data () {
      return {
        userName: '',
        resultList: [],
        isShow: false,
        express: {},
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
                    label: '送达地址',
                    value: data.expressGoalAddress
                  }
                ],
                button: [
                  {
                    style: 'primary',
                    text: '查看详情',
                    onButtonClick: (name) => {
                      this.express = data
                      this.isShow = true
                    }
                  }
                ],
              }
            )
          },
        )
      },
      selectDeliveryman () {
        this.$http.get('express/delivery/' + this.userName).then(response => {
          let resultList = response.data.data
          if (resultList.length !== 0) {
            this.formatForPreview(resultList.sort((item1, item2) => {

              return item2.expressDate - item1.expressDate
            }))
          }
          this.formatForPreview(response.data.data)
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      }
    },

    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
      this.userName = this.$store.getters.getUser.username
      this.selectDeliveryman()
    }
  }
</script>

<style scoped lang="less">

</style>
