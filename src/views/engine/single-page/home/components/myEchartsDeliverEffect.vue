<template>
  <div>
    <Row>
      <Col span="4">
        <div style="display: flex;align-items: center;">
          <div style="width: 74px;">装车时间:</div>
          <div style="width: 200px;">
            <DatePicker v-model="date3" :options="options2" @on-change="date3Change($event)" type="daterange" placement="bottom-start" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
          </div>
        </div>
      </Col>
      <Col span="7">
        <div style="display: flex;align-items: center;">
          <div style="width: 10px;"></div>
          <div>
            <RadioGroup v-model="args3.transportType" @on-change="getFirstDeliverEffect" type="button">
                <Radio v-for="(item,idx) in statusType" :key="'idx_'+idx" :label="item.val"><span>{{ item.label }}</span></Radio>
            </RadioGroup>
          </div>
        </div>
      </Col>
      <Col span="2" style="text-align: left">
        <Button type="primary" @click="getFirstDeliverEffect" :loading="tableLoading" class="es-button-right">查询</Button>
      </Col>
    </Row>
    <Row>
      <div  id="dom3" v-if="!initBar3lent"  class="qqqq chart-box" style="height: 540px;margin-top: 10px;"></div>
      <div  v-if="initBar3lent"  class="wwww" style="height: 540px;margin-top: 10px;background-color: #fff;text-align: center;line-height: 540px;">
        暂无数据
      </div>
      <!-- 2022.11.2 这个版本不需要，留着后期看要不要 -->
      <Table border v-if="false"  stripe highlight-row :loading="tableLoading" :columns="tableColumns3" :data="tableData3"
        ref="table" >
      </Table>
    </Row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { on } from '@/libs/tools'
import * as home from '@/api/home.api.js'
export default {
  data() {
    return {
      date3: [], // 时间双向绑定 - 头程时效看板
      args3: { // 查询参数-头程时效看板
        deliverTimeStart: '', // 装车开始时间
        deliverTimeEnd: '', // 	装车结束时间
        transportType: '0', // 运输方式(0：空派，1：海派，2：快递，3：卡航。4：铁运)
        shippingCompanyIds: []// 物流商id集合
      },
      options2: {
        shortcuts: [
          {
            text: '近一周',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '本月',
            value() {
              /**
              * 获取本周、本季度、本月、上月的开端日期、停止日期
              */
              var now = new Date() // 当前日期
              var nowDay = now.getDate() // 当前日
              var nowMonth = now.getMonth() // 当前月
              var nowYear = now.getYear() // 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0 //
              // 格局化日期：yyyy-MM-dd
              function formatDate(date) {
                var myyear = date.getFullYear()
                var mymonth = date.getMonth() + 1
                var myweekday = date.getDate()

                if (mymonth < 10) {
                  mymonth = '0' + mymonth
                }
                if (myweekday < 10) {
                  myweekday = '0' + myweekday
                }
                return (myyear + '-' + mymonth + '-' + myweekday)
              }
              // 获得某月的天数
              function getMonthDays() {
                return nowDay
              }
              // 获得本月的开端日期
              function getMonthStartDate() {
                var monthStartDate1 = new Date(nowYear, nowMonth, 1)
                let str = formatDate(monthStartDate1)
                return str
              }
              // 获得本月的停止日期
              function getMonthEndDate() {
                var monthEndDate1 = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
                let str = formatDate(monthEndDate1)
                return str
              }
              console.log('本月', getMonthStartDate(), getMonthEndDate())
              return [`${getMonthStartDate()}`, `${getMonthEndDate()}`] // 设置本月时间，数组
            }
          },
          {
            text: '近三个月',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      pullShippingCompany: {}, // 获取有效的头程物流商
      tableLoading: false,
      initBar3lent: true,
      statusType: [
        // { val: '', label: '全部' },
        { val: '0', label: '空派' },
        { val: '1', label: '海航' },
        { val: '2', label: '快递' },
        { val: '3', label: '卡航' },
        { val: '4', label: '铁运' }
      ],
      tableData3: [], // 头程时效看板 table数据
      tableColumns3: [ // 头程时效看板 table数据
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        }, {
          title: '物流商',
          key: 'shippingCompanyCode',
          minWidth: 180,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', this.pullLogisticsProvider[row.shippingCompanyId])
          }
        }, {
          title: '运输方式',
          width: 180,
          key: 'transportType',
          align: 'center'/* ,
          render: (h, { row, index, column }) => {
            return h('div', this.seekLabelList(row.transportType, this.statusType))
          } */
        }, {
          title: '装车时间',
          key: 'deliverMonth',
          minWidth: 180,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', row.deliverMonth)
          }
        }, {
          title: '发货数量',
          key: 'deliverCount',
          width: 180,
          align: 'center'
        }, {
          title: '妥投率',
          key: 'effectRate',
          width: 180,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', row.effectRate + '%')
          }
        }, {
          title: '操作',
          width: 160,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', [
              h('Button', {
                props: { type: 'info', size: 'small', ghost: true },
                style: { 'margin-top': '4px', 'margin-right': '4px' },
                on: {
                  click: () => {
                    this.viewDetail3(row)
                  }
                } }, '查看详情')
            ])
          }
        }
      ],
      data: {
        data3: []
      }
    }
  },
  created() {
    this.getFindSelectValues()
  },
  methods: {
    date3Change(date) { // 头程时效看板-
      this.args3.deliverTimeStart = date[0] // 开始日期
      this.args3.deliverTimeEnd = date[1]
    },
    initAll3() {
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data3).length == 0) {
          this.initBar3lent = true
        } else {
          this.initBar3lent = false
        }
        setTimeout(() => {
          this.initBar3_1('dom3', { title: '头程时效看板', data: datas.data3 || {} })
        }, 300)
      })
    },
    initBar3(id, data) { // 横向-柱状图 头程时效看板-老版本，防止切换过去
      // console.log('initBar3-val', id, data)
      let seriesValue = []
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      // console.log(this.$cloneDeep(data.data), 'item--0', typeof data.data)
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let resultarr = []
      var start = resultarr.length - 6
      var end = resultarr.length - 1
      if (data) {
        let temp = data.data

        let arr1 = []
        if (Object.keys(temp).length == 0) {
          resultarr = []
          arr1 = []
          this.initBar3lent = true
          // console.log(0, 'length--0has哈哈哈', 'initBar3lent:', this.initBar3lent)
          seriesValue = []
          data.data = {}
        } else {
          this.initBar3lent = false
          let mmm = []
          if (temp.shippingCompany3) {
            mmm = temp.shippingCompany3.map(item => item.deliverMonth)
          } else if (temp.shippingCompany0) {
            mmm = temp.shippingCompany0.map(item => item.deliverMonth)
          }
          seriesValue = mmm.map((key, index) => {
            return {
              name: key,
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              barMaxWidth: 36, // 柱图宽度
              data: Object.keys(temp).map(key => temp[key][index].effectRate)
            }
          })
          // console.log('seriesValue--444', seriesValue, mmm)
          // console.log('initBar3lent222:', this.initBar3lent)
          Object.keys(temp).forEach(function(key, idx) {
            // console.log(key, temp[key], 'Object--333', idx)
            temp[key].forEach(function(item, idx1) {
              arr1.push(item.shippingCompanyName)
              resultarr = [...new Set(arr1)]
            })
          })

          // console.log( 'seriesValue--444', seriesValue)
        }
      } else {
        console.log('seriesValue--else')
      }
      var option = {
        title: {
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: start,
            endValue: end
          },
          {
            // zoomLock: true,
            type: 'inside'
          }
        ],
        legend: {
          right: '8%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          name: '物流商',
          type: 'category',
          offset: 7,
          axisLabel: {
            interval: 0,
            rotate: '50',
            lineHeight: 18,
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 8// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) { // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else { // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: resultarr
          // data: data.data.map(item => item.name)
        },
        yAxis: {
          name: '妥投率%',
          type: 'value'
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
        series: seriesValue
      }
      if (id == 'dom5') {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      } else {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      }
      let that = this
      // echarts图表点击跳转
      myChart.on('click', function(param) {
        var name = param.name
        let month = param.seriesName
        let idsObj = that.pullShippingCompany // 物流商
        let shippingCompanyId = ''
        for (var key in idsObj) { // 遍历对象的所有属性，包括原型链上的所有属性
          if (idsObj[key].includes(name)) { // 判断是否是包含
            shippingCompanyId = key
            // console.log(key, '包含', idsObj[key]) // 键名- 键值
          }
        }
        // console.log(param, 'echarts图表点击跳转', name, month, 'data3', data, '物流商', shippingCompanyId)
        that.$router.push({
          name: 'batch-management',
          params: {
            shippingCompanyId: shippingCompanyId || -1,
            month: month || -1
          }
        })
      })
      // option && myChart.setOption(option)
    },
    initBar3_1(id, data) { // 横向-柱状图 头程时效看板-最新
      console.log('initBar3_1-val++', id, data)
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      let option = {
        title: {
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            let firstParams = params[0]
            let transportType = data.data[firstParams.dataIndex].transportType
            let deliverCount = data.data[firstParams.dataIndex].deliverCount
            let deliverMonth = data.data[firstParams.dataIndex].deliverMonth
            let result = `发货总数：${deliverCount}` + '<br>' + `装车时间：${deliverMonth} `
            return firstParams.name + '<br>' + `运输方式：${transportType} ` + '<br>' + result + '<br>' + '妥投率：' + firstParams.data + ' %'
          }
        },
        dataZoom: [
          {
            show: false,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 14
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          name: '物流商',
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
            lineHeight: 18,
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 6// 每行能显示的字的个数
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              if (paramsNameNumber > provideNumber) {
                newParamsName = params.substring(0, 8) + '..'// 最终拼成的字符串
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: data.data.map(item => item.shippingCompanyName)
        },
        yAxis: {
          name: '妥投率%',
          type: 'value',
          min: 0,
          max: 100,
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '妥投率',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.effectRate),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      if (id == 'dom5') {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      } else {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      }
      myChart.getZr().off('click')
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.getZr().on('mousemove', param => {
        var pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        var pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          let temp1 = data.data
          let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          let temp2 = temp1[xIndex]
          // console.log('xIndex', xIndex, JSON.parse(JSON.stringify(temp1[xIndex])), 'temp1', temp1, 'temp2', temp2)
          this.viewDetail3(temp2)
        }
      })
    },
    getFirstDeliverEffect() { // 头程时效看板
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      this.tableLoading = true
      if (this.args3.transportType == '') {
        delete this.args3.transportType
      }
      if (this.args3.shippingCompanyIds.length <= 0) {
        delete this.args3.shippingCompanyIds
      }
      home.getFirstDeliverEffect(this.args3).then(res => {
        if (res.data.success) {
          if (!this.args3.shippingCompanyIds) this.args3.shippingCompanyIds = []
          this.tableData3 = res.data.result || []
          this.data.data3 = res.data.result ? this.$cloneDeep(res.data.result) : {}
          this.initAll3()
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取头程时效看板数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    viewDetail3(row) { // 头程时效看板-查看详情
      console.log('查看详情', this.$cloneDeep(row))
      this.$router.push({
        name: 'batch-management',
        params: {
          shippingCompanyId: row.shippingCompanyId + '' || -1,
          deliverMonth: row.deliverMonth,
          transportType: row.transportType
        }
      })
    },
    getFirstEffect3() { // 头程时效看板
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      const _this = this
      _this.tableLoading = true
      if (this.args3.transportType == '') {
        delete this.args3.transportType
      }
      if (this.args3.shippingCompanyIds.length <= 0) {
        delete this.args3.shippingCompanyIds
      }
      home.getFirstEffect(this.args3).then(res => {
        if (res.data.success) {
          if (!_this.args3.shippingCompanyIds) {
            _this.args3.shippingCompanyIds = []
          }
          _this.data.data3 = res.data.result ? this.$cloneDeep(res.data.result) : {}
          _this.initAll3()
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取头程时效看板数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    getTotalCompany1() { // 获取有效的头程物流商--头程时效看板
      const _this = this
      home.getTotalCompany().then(function(res) {
        if (res.data.success) {
          _this.pullShippingCompany = res.data.result ? res.data.result : {}
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取有效的头程物流商数据失败-500', duration: 4 })
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    resize() {
      this.dom.resize()
    },
    resize1() {
      this.dom1.resize()
    }
  }
}
</script>
