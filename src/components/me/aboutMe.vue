<template>
  <div>
    <group style="text-align: center">
      <divider>送给开发者一杯咖啡</divider>
      <img :src="moneyImg" alt="收款二维码" width="60%" height="60%">
    </group>
    <divider></divider>
    <group style="text-align: center">
      <divider>联系开发者</divider>
      <img :src="meImg" alt="我的二维码" width="60%" height="60%">
    </group>
    <div class="space"></div>
  </div>
</template>

<script>
  import {
    Group,
    Divider
  } from 'vux'

  import moneyImg from '@/assets/images/money.jpg'
  import meImg from '@/assets/images/me.jpg'
  import EventBus from '@/EventBus'

  export default {
    name: 'aboutMe',
    components: {
      Divider,
      Group
    },
    data () {
      return {
        moneyImg: moneyImg,
        meImg: meImg
      }
    },
    created () {
      EventBus.$emit('appMark', {
        item: 1
      })
    }
  }
</script>

<style scoped>

</style>
