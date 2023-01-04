<template>
  <div>
    <Row :gutter="20">
      <i-col span="5" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        1234567{{ infor.title }}
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'homeV',
  components: {
  },
  data() {
    return {
      inforCardData: [
        { title: '昨日发货票量', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '昨日票均成本', icon: 'md-locate', count: 23432, color: '#19be6b' },
        { title: '昨日新增妥投超时', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '待索赔包裹', icon: 'md-share', count: 657, color: '#ed3f14' }
        // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted() {
    //
  }
}
</script>

<style lang="less">
  .count-style{
    font-size: 50px;
  }
</style>
