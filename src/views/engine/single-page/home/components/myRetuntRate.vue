<template>
  <div class="myRetuntRate">
    <Row>
      <Col span="5">
        <div style="display: flex;align-items: center;">
          <div style="width: 74px;">平台:</div>
          <div style="width: 320px;">
            <Select v-model="args4.search.saleChannels" @on-change="changeSaleChannels($event)" clearable filterable placeholder="请选择">
                <Option v-for="item in saleChannels" :value="item.code||''" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </Col>
      <Col span="4" style="text-align: left" offset="1">
        <RadioGroup v-model="args4.order" @on-change="getDeliverOrderInfo" type="button">
          <Radio v-for="(item,idx) in statusType4" :key="'idx_'+idx" :label="item.val"><span>{{ item.label }}</span></Radio>
        </RadioGroup>
      </Col>
      <Col span="2" style="text-align: left">
        <Button type="primary" :loading="tableLoading"  @click="getDeliverOrderInfo"  class="es-button-right">查询</Button>
      </Col>
    </Row>
    <Row>
      <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;width: 100%;">
        <div id="dom4_1" v-show="data.data4.refuntRate0.length" :style="{width:boxWidth+'%'}" class="chart-box h_m_t_w_b" style="border: 1px solid red;"></div>
        <div id="dom4_2" v-show="data.data4.refuntRate1.length" :style="{width:boxWidth+'%'}" class="chart-box h_m_t_w_b" style="border: 1px solid rgb(27, 182, 79);"></div>
        <div id="dom4_3" v-show="data.data4.refuntRate2.length" :style="{width:boxWidth+'%'}" class="chart-box h_m_t_w_b" style="border: 1px solid rgb(28, 15, 199);"></div>
        <div  v-if="!data.data4.refuntRate0.length" class="chart-box h_m_t_w_b" >
          <div id="dom4_111"></div>
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
import echarts from 'echarts'
import * as home from '@/api/home.api.js'
import { on } from '@/libs/tools'
export default {
  props: {
    saleChannels: { // 平台
      default: () => [],
      type: Array,
      required: false
    }
  },
  data() {
    return {
      args4: { // 查询参数
        search: {
          saleChannels: ['SMT'] // 	平台
        },
        pageReqired: true,
        order: 'refundrate desc',
        limit: 5,
        offset: 0
      },
      type4: 'bar',
      button4: '柱状图',
      statusType4: [
        { val: 'refundrate asc', label: '正序排列' },
        { val: 'refundrate desc', label: '倒序排列' }
      ],
      boxWidth: 30,
      data: {
        data4: {
          refuntRate0: [],
          refuntRate1: [],
          refuntRate2: []
        }
      },
      tableLoading: false
    }
  },
  methods: {
    changeSaleChannels(val) {
      if (typeof val == 'undefined') {
        this.args4.search.saleChannels = []
      }
    },
    initAll() {
      this.$nextTick(() => {
        let datas = this.data
        if (datas.data4.refuntRate0.length) {
          this.initBar4('dom4_1', { title: '退款率', data: datas.data4.refuntRate0 || [] })
        }
        if (datas.data4.refuntRate1.length) {
          this.initBar4('dom4_2', { title: '退款率', data: datas.data4.refuntRate1 || [] })
        }
        if (datas.data4.refuntRate2.length) {
          this.initBar4('dom4_3', { title: '退款率', data: datas.data4.refuntRate2 || [] })
        }
      })
    },
    initBar4(id, data) { // 横向-柱状图 退款率
      // console.log('initBar4-val', id, data)
      var chartDom = document.getElementById(id)
      var myChart = echarts.init(chartDom)
      let option = {
        title: {
          left: 'center',
          text: data.data[0] && data.data[0].month + data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            // console.log('formatter', params) // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            let firstParams = params[0]
            return firstParams.name + '<br>' + '退款率：' + firstParams.data + ' %'
          }
        },
        grid: {
          left: '3%',
          right: '12%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          orient: 'horizontal', // 水平
          data: data.data.map(item => item.shippingmethod),
          bottom: 'bottom'
        },
        toolbox: {
          show: false
        },
        xAxis: [
          {
            name: '物流方式',
            type: 'category',
            // show: false,
            axisLabel: {
              show: true,
              interval: 0,
              // rotate: '50',
              lineHeight: 18,
              formatter: function(params) {
                // console.log('formatter', params, params.length)
                var newParamsName = ''// 最终拼接成的字符串
                var paramsNameNumber = params.length// 实际标签的个数
                var provideNumber = 6// 每行能显示的字的个数
                // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                if (paramsNameNumber > provideNumber) {
                  newParamsName = params.substring(0, 6) + '..'// 最终拼成的字符串
                } else { // 将旧标签的值赋给新标签
                  newParamsName = params
                }
                // 将最终的字符串返回
                return newParamsName
              }
            },
            data: data.data.map(item => item.shippingmethod), // 如果我把这个注释了 鼠标悬浮就不显示了
            // data: data.data.map(item => item.shippingmethod.substring(0, 6) + '...'), // 如果我把这个注释了 鼠标悬浮就不显示了
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          { type: 'value', name: '退款率%' }
        ],
        series: [
          {
            name: '退款率',
            type: this.type4,
            barMaxWidth: 20, // 柱图宽度
            data: data.data.map(item => item.refundrate),
            itemStyle: {
              normal: {
                // 这里是重点
                color: function(params) {
                  var colorList = ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#d48265', '#91c7ae', '#ca8622']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      if (id == 'dom3') {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      } else {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      }
    },
    resize() {
      this.dom.resize()
    },
    resize1() {
      this.dom1.resize()
    },
    getDeliverOrderInfo() { // 退款率
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      this.tableLoading = true
      home.getDeliverOrderInfo(this.args4).then(res => {
        if (res.data.success) {
          if (res.data.result) {
            let temp1 = res.data.result.refuntRate0.length > 0
            let temp2 = res.data.result.refuntRate1.length > 0
            let temp3 = res.data.result.refuntRate2.length > 0
            if (temp1 && temp2 && temp3) { // 三个月份都有
              this.boxWidth = parseInt((100 / 3) - 2)
            } else if ((temp1 && temp2) || (temp2 && temp3) || (temp1 && temp3)) { // 只有任意两个月份
              this.boxWidth = parseInt((100 / 2) - 2)
            } else if (temp1 || temp2 || temp3) { // 三个月份中值满足一个月份
              this.boxWidth = parseInt((100 / 1) - 2)
            } else {
              console.log('都不满足')
            }
            // console.log(this.boxWidth, '退款率11--0', temp1, temp2, temp3)
          }
          this.data.data4 = res.data.result ? res.data.result : []
          this.initAll()
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取退款率数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>
