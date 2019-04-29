<template>
  <div>
    <x-table
      :full-bordered="true"
      class="x_table"
    >
      <thead>
      <tr class="x_thead">
        <th @click="expressNameSort">快递名称
          <x-icon type="ios-arrow-thin-up" size="16"></x-icon>
        </th>
        <th @click="goalAddressSort">送达地址
          <x-icon type="ios-arrow-thin-up" size="16"></x-icon>
        </th>
        <th @click="rewardSort">赏金
          <x-icon type="ios-arrow-thin-up" size="16"></x-icon>
        </th>
      </tr>
      </thead>
      <tbody v-if="!expressList">
      <tr>
        <td colspan="3" style="color: #898989">
          —————— 暂无数据 ——————
        </td>
      </tr>
      </tbody>
      <tbody v-else v-for='express in expressList' :key="express.expressId">
      <tr @click="seeDetails(express)">
        <td>{{ express.expressName }}</td>
        <td>{{ express.expressGoalAddress }}</td>
        <td>{{ express.expressReward }}&nbsp;元</td>
      </tr>
      </tbody>
    </x-table>
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
                <strong>性别限制</strong>
              </th>
              <td>
                {{ express.expressSex }}
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
          <br/>
          <div>
            <x-button @click.native="showConfirm = true" class="x_button" plain type="primary">
              接受
            </x-button>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :close-on-confirm="false"
        title="确认订单"
        @on-confirm="chooseExpress">
        <p style="text-align:center;">您确定接受此快递订单吗？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showLogin"
        :close-on-confirm="false"
        title="您还未登录"
        @on-confirm="onConfirm">
        <p style="text-align:center;">您要登录吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import {
    Confirm,
    TransferDom,
    Popup,
    XTable,
    XButton,
    Divider
  } from 'vux'
  import EventBus from '@/EventBus'

  export default {
    name: 'expressList',
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XTable,
      Popup,
      XButton,
      Divider
    },
    data () {
      return {
        expressList: [],
        isShow: false,
        express: {},
        showConfirm: false,
        showLogin: false,
        userName: ''
      }
    },
    methods: {
      seeDetails (express) {
        this.isShow = true
        this.express = express
      },
      close () {
        this.isShow = false
      },
      expressNameSort () {
        this.expressList.sort(
          (item1, item2) =>
            item1.expressName.localeCompare(item2.expressName, 'zh')
        )
      },
      goalAddressSort () {
        this.expressList.sort(
          (item1, item2) =>
            item1.expressGoalAddress.localeCompare(item2.expressGoalAddress, 'zh')
        )
      },
      rewardSort () {
        function mathSort (item1, item2) {
          return parseFloat(item1.expressReward) - parseFloat(item2.expressReward)
        }

        this.expressList.sort(mathSort)
      },
      chooseExpress () {
        this.showConfirm = false
        let data = new FormData()
        data.append('expressSecurityuserId', this.express.expressSecurityuserId)
        data.append('userName', this.userName)
        this.$http.put('express/' + this.express.expressId, data).then(response => {
          if (response.data.status === 401) {
            this.showLogin = true
            return
          }
          if (response.data.status === 200) {
            this.$vux.toast.text(response.data.message, 'middle')
            this.getExpressList()
            this.isShow = false
            return
          }
          this.getExpressList()
          this.$vux.toast.text(response.data.message, 'middle')
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      },
      onConfirm () {
        this.$vux.loading.show({
          text: '跳转中...'
        })
        setTimeout(() => {
          this.$router.push(
            {name: 'login', params: {redirectPath: this.$route.fullPath.toString()}})
          this.$vux.loading.hide()
          this.showConfirm = false
        }, 1000)
      },
      getExpressList () {
        this.$http.get('express').then(response => {
          this.expressList = response.data.data
        }).catch(error => {
          this.$vux.toast.text('未知错误' + error, 'middle')
        })
      }
    },
    created () {
      this.getExpressList()
      this.userName = this.$store.getters.getUser.username
    },
    mounted () {
      EventBus.$emit('expressMark', {
        item: 0
      })
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

  .x_table {
    background-color: #fff
  }

  .x_thead {
    background-color: #F7F7F7
  }

  .x_button {
    width: 88%;
  }


  .popup {
    padding-bottom: 15px;
    height: auto;
  }
</style>

