<template>
  <div>
    <div>
      <group>
        <popup-picker :popup-title="'请选择您的快递名称'" :title="'选择快递名称'" :data="expressNameList"
                      v-model="expressName" :placeholder="'请选择快递名称'">
          <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="vertical-align:middle;">快递名称</span>
          </span>
          </template>
        </popup-picker>
      </group>
      <group>
        <x-textarea title="快递地址：" v-model="expressAddress" :placeholder="'请输入快递地址'"
                    :show-counter="true" :max="30" autosize></x-textarea>
      </group>
      <br/>
      <group title="送达地址">
        <selector ref="valueMapRef" placeholder="请选择楼号" v-model="building" title="楼号"
                  :options="buildingArray"/>
        <x-input :readonly="building === ''" title="地址补充：" v-model="supplementAddress"
                 :placeholder="building === '' ? '请先选择楼号':'请输入您的地址'" autosize></x-input>
        <cell-box v-show="building !== ''" v-text="'您的地址为：' + goalAddress"
                  style="color: #898989;"></cell-box>
      </group>
      <br/>
      <group title="快递取货号仅仅用于短信通知，请放心填写">
        <x-input title="快递取货号" v-model="expressCode" placeholder="请输入您的取货号" novalidate
                 @on-blur="rewardInspect"
                 text-align="center" placeholder-align="center" :required="true"></x-input>
      </group>
      <br/>
      <group title="快递重量">
        <checker
          v-model="weight"
          default-item-class="checker-item"
          selected-item-class="checker-item-selected"
          @on-change="setReward"
          :radio-required="true"
        >
          <checker-item class="checker-style" v-for="weight in weightList" :key="weight"
                        :value="weight">{{ weight }}
          </checker-item>
        </checker>
      </group>
      <br/>
      <group>
        <x-input title="悬赏金额" v-model="reward" :placeholder="rewardSuggest" novalidate
                 @on-blur="rewardInspect"
                 text-align="center" placeholder-align="center" :required="true"></x-input>
      </group>
      <br/>
      <group title="领取者性别限制">
        <checker v-model="sex" default-item-class="checker-item-radius"
                 selected-item-class="checker-item-selected-radius" :radio-required="true">
          <checker-item value="仅限男" class="checker-style-radius">仅限男</checker-item>
          <checker-item value="不限" class="checker-style-radius">不限</checker-item>
          <checker-item value="仅限女" class="checker-style-radius">仅限女</checker-item>
        </checker>
      </group>
      <br/>
      <group>
        <x-textarea title="备注：" v-model="remark" :placeholder="'请输入备注信息'"
                    :show-counter="true"
                    :max="100" autosize></x-textarea>
      </group>
      <divider>
        <check-icon :value.sync="isConsent">我同意货到后支付酬金</check-icon>
      </divider>
      <flexbox>
        <flexbox-item>
          <x-button @click.native="reset" class="mini-button" action-type="button" plain
                    type="warn">清空
          </x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="submitExpress" class="mini-button" action-type="button" plain
                    type="primary" :disabled="!isConsent">提交
          </x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="space"></div>
    <toast v-model="toastShow" type="warn" position="top">金额不合理</toast>
    <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" hide-on-blur class="dialog">
        <div class="dialog-box">
          <div class="countupGroup">
            <p class="p-left">我们已为</p>
            <countup :start-val="0" :end-val="count" :duration="2" class="countupFont"></countup>
            <p class="p-right">人提供了快递信息</p>
            <br/>
            <p class="p-left">共达成交易额：</p>
            <span class="countupFont">￥</span>
            <countup :start-val="0" :end-val="rewardSum" :duration="3" :decimals="2"
                     class="countupFont"></countup>
            <br>
          </div>
          <divider>-</divider>
          <div @click="closeBlur">
            <span class="vux-close"></span>
          </div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
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
    PopupPicker,
    Picker,
    Divider,
    Group,
    PopupRadio,
    Countup,
    XDialog,
    XInput,
    XTextarea,
    XButton,
    Toast,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom,
    Confirm,
    Selector,
    Cell,
    Checker,
    CheckerItem,
    CellBox,
    CheckIcon
  } from 'vux'

  import Moment from 'moment'

  const dataJson = require('../../assets/data')
  export default {
    name: 'expressIssue',
    directives: {
      TransferDom
    },
    components: {
      PopupPicker,
      Picker,
      Divider,
      XDialog,
      Countup,
      Toast,
      Group,
      PopupRadio,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem,
      XTextarea,
      Confirm,
      Selector,
      Cell,
      Checker,
      CheckerItem,
      CellBox,
      CheckIcon
    },
    data () {
      return {
        showHideOnBlur: false,
        expressNameList: dataJson.pickerExpressNameList,
        expressName: [],
        supplementAddress: '',
        expressAddress: '',
        remark: '',
        toastShow: false,
        showConfirm: false,
        buildingArray: dataJson.mathList,
        building: '',
        weight: '',
        reward: '',
        expressCode: '',
        rewardSuggest: '请输入悬赏金额（元）',
        weightList: dataJson.weightList,
        userName: '',
        sex: '',
        count: 0,
        rewardSum: 0.00,
        isConsent: false
      }
    },
    computed: {
      goalAddress () {
        return (this.building + this.supplementAddress).trim()
      },
      isSubmit () {
        return this.expressName[0] === '' ||
          this.goalAddress === '' ||
          this.expressAddress === '' ||
          this.sex === '' ||
          this.weight === ''
      },
    },
    methods: {
      setReward (weight) {
        if (weight === '0.00kg ~ 1.00kg') {
          this.rewardSuggest = '建议价格 2.00'
        }
        if (weight === '1.00kg ~ 2.00kg') {
          this.rewardSuggest = '建议价格 3.00'
        }
        if (weight === '2.00kg ~ 3.00kg') {
          this.rewardSuggest = '建议价格 4.00'
        }
        if (weight === '3.00kg 以上') {
          this.rewardSuggest = '请根据您的重量设置合理的酬金'
        }
      },
      reset () {
        this.expressName = []
        this.building = ''
        this.expressAddress = ''
        this.remark = ''
        this.reward = ''
        this.supplementAddress = ''
        this.userName = ''
        this.expressCode = ''
        this.weight = ''
        this.sex = ''
      },
      rewardInspect () {
        if (this.reward === ''){
          return
        }
        let isMath = /^[0-9]+\.?[0-9]*$/
        if (!isMath.test(this.reward)) {
          this.toastShow = true
          this.reward = ''
          return
        }
        if (this.reward.endsWith('.') || this.reward <= 0) {
          this.toastShow = true
          this.reward = ''
          return
        }
        let isInteger = /^\d+$/
        if (isInteger.test(this.reward)) {
          this.reward = this.reward + '.00'
          return
        }
        let isFloat = /^\d+|\d+\.\d$/
        if (isFloat.test(this.reward)) {
          this.reward = this.reward + '0'
        }
      },
      submitExpress () {
        if (this.isSubmit) {
          this.$vux.toast.text('您有未填项', 'middle')
          return
        }
        if (this.reward === '') {
          this.$vux.toast.text('请设置报酬金额', 'middle')
          return
        }
        if (this.expressCode === ''){
          this.$vux.toast.text('请输入您的取货号', 'middle')
          return
        }
        let data = new FormData()
        data.append('expressName', this.expressName[0])
        data.append('expressGoalAddress', this.goalAddress)
        data.append('expressAddress', this.expressAddress)
        data.append('expressCode', this.expressCode)
        data.append('expressReward', this.reward)
        data.append('expressRemark', this.remark)
        data.append('expressWeight', this.weight)
        data.append('expressSex', this.sex)
        data.append('expressDate', Moment(Moment()))
        data.append('userName', this.userName)
        this.$http.post('express', data).then(response => {
          if (response.data.status === 401) {
            this.showConfirm = true
            return
          }
          if (response.data.status === 200) {
            this.$vux.toast.text(response.data.message, 'middle')
            this.reset()
            this.$router.push({name: 'expressList'})
            return
          }
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
      closeBlur () {
        this.showHideOnBlur = false
        if (!this.userName) {
          this.showConfirm = true
        }
      }
    },
    created () {
      this.userName = this.$store.getters.getUser.username
      this.$http.get('express/count').then(response => {
        if (response.data.status === 200) {
          this.count = response.data.count
          this.rewardSum = response.data.rewardSum
          this.showHideOnBlur = true
          return
        }
        if (!this.userName) {
          this.showConfirm = true
        }
      }).catch(error => {
        this.$vux.toast.text('未知错误' + error, 'middle')
      })
    },
    destroyed () {
      this.reset()
    },
    mounted () {

    }

  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close';

  .dialog {
    .dialog-box {
      height: auto;
      overflow: hidden;
    }

    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }

    .vux-close {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }


  .countupGroup {
    text-align: center;
  }

  .countupFont {
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    font-size: 4.4em;
    color: #04BE02;
  }

  .p-left {
    font-weight: bold;
    font-size: 1em;
    margin-left: -36%;
    color: #6E6E6E;
  }

  .p-right {
    font-weight: bold;
    font-size: 1em;
    margin-right: -30%;
    color: #6E6E6E;
  }

  .headerLittle {
    text-align: center;
    padding: 8px 0;
    color: #888;
  }

  .mini-button {
    border-radius: 46px;
  }

  .checker-item {
    width: 120px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #F7F7FA;
    margin-right: 6px;
  }

  .checker-item-selected {
    background: #ffffff url(../../assets/images/active.png) no-repeat right bottom;
    border-color: #ff4a00;
  }

  .checker-style {
    margin: 1% 5% 1% 6%;
  }

  .checker-item-radius {
    width: 60px;
    height: 40px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
  }

  .checker-item-selected-radius {
    border-color: green;
  }

  .checker-style-radius {
    margin-left: 11%;
  }

</style>
