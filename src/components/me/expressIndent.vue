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
                      :name="result.expressId"></form-preview>
        <divider>
          <hr/>
        </divider>
      </div>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
  import Moment from 'moment'
  import {
    XHeader,
    FormPreview,
    Divider,
    XButton
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'expressIndent',
    components: {
      XHeader,
      FormPreview,
      Divider,
      XButton
    },
    data () {
      return {
        userName: '',
        resultList: []
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
                ],
                button: [
                  data.expressStatus === 2 ? {} : {
                    style: 'primary',
                    text: '标记为已完成',
                    onButtonClick: (name) => {
                      this.$http.delete('express/' + name).then(
                        response => {
                          this.$vux.toast.text(response.data.message, 'middle')
                          if (response.data.status === 200) {
                            this.selectExpress()
                          }
                        }).catch(error => {
                        this.$vux.toast.text('未知错误' + error, 'middle')
                      })
                    }
                  }
                ],
              }
            )
          },
        )
      },
      selectExpress () {
        this.$http.get('express/' + this.userName).then(response => {
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
      this.selectExpress()
    }
  }
</script>

<style scoped lang="less">

</style>
