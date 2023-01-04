<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data() {
    return {
      dom: null
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    }
  },
  mounted() {
    const option = {
      title: {
        left: 'center',
        text: '发货汇总',
        textStyle: { // 文本样式
          fontSize: 24,
          fontWeight: 600,
          color: '#515a6e'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        orient: 'horizontal', // 'horizontal'（水平） ¦ 'vertical'（垂直）
        x: 'left',
        y: 'top',
        data: ['票量', '重量']
      },
      grid: {
        top: '14%',
        left: '1.2%',
        right: '1%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          data: ['2021-12-20', '2021-12-21', '2021-12-22', '2021-12-23']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '运营商/网络服务',
          type: 'line',
          stack: '总量',
          data: [120, 132, 270, 134]
        },
        {
          name: '银行/证券',
          type: 'line',
          stack: '总量',
          data: [257, 358, 278, 140]
        },
        {
          name: '游戏/视频',
          type: 'line',
          stack: '总量',
          data: [379, 500, 120, 269]
        }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize())
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize())
  }
}
</script>
