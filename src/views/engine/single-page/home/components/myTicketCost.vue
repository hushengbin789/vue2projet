<template>
  <div>
    <!-- 揽收公司、平台、物流方式、物流级别、国家 -->
    <Row>
      <Col span="3">
        <div style="display: flex;align-items: center;" >
          <div style="width: 74px;">揽收公司:</div>
          <div >
            <Select v-model="searForm.collectCompanyId"  clearable filterable placeholder="请输入揽收公司">
              <Option v-for="item in collectCompanys" :value="item.val||''" :key="item.val">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="3" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;">
          <div style="width: 40px;">平台:</div>
          <div class="xxxx4" style="width: 180px;">
            <Select v-model="searForm.saleChannelList" multiple :max-tag-count="1" clearable filterable placeholder="请选择">
                <Option v-for="item in saleChannels" :value="item.code||''" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="5" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;" >
          <div style="width: 75px;">物流方式:</div>
          <div class="xxxx4" style="width: 274px;">
            <Select style="width: 100%;" v-model="searForm.shippingMethodCodeList" multiple :max-tag-count="1" clearable filterable placeholder="请选择物流方式">
              <Option v-for="item in shippingmethodss" :value="item.code||''" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;">
          <div style="width: 40px;">国家:</div>
          <div class="xxxx4">
            <Select style="width: 230px;" v-model="searForm.countryList" multiple :max-tag-count="1" clearable filterable placeholder="请选择国家">
              <Option v-for="(item, key) in countries" :value="item.twowordname || ''" :key="item.twowordname + `_${key}`">{{item.chinesename1}}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col style="width: 15%;max-width: 15%;float: left;">
        <div style="display: flex;align-items: center;">
          <div style="width: 74px;">装车时间:</div>
          <div style="width: 180px;">
            <DatePicker v-model="date2" :options="options2" @on-change="date2Change($event)" type="daterange" placement="bottom-end" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
          </div>
        </div>
      </Col>
      <!-- <Col span="2">
        <div style="display: flex;align-items: center;" >
          <div style="width: 42px;">级别:</div>
          <div >
            <Select v-model="searForm.shippingMethodLevelList" multiple :max-tag-count="1" clearable filterable placeholder="请选择">
                <Option value="M">平邮</Option>
                <Option value="R">挂号</Option>
                <Option value="E">快递</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col> -->
      <Col  style="text-align: left;display: inline-block;">
        <div>
          <RadioGroup v-model="button2" style="float: left" type="button" size="large" @on-change="changeType2">
            <Radio label="柱状图" border></Radio>
            <Radio label="折线图" border></Radio>
          </RadioGroup>
        </div>
      </Col>
      <Col span="1" style="text-align: left;display: inline-block;margin-left: 4px;">
        <Button type="primary" @click="getFindAverage" :loading="tableLoading" >查询</Button>
        <span>&nbsp;</span>
      </Col>
    </Row>
    <Row>
      <div id="dom2" style="height: 540px;margin-top: 10px;"></div>
    </Row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { on } from '@/libs/tools'
import * as perTicket from '@/api/perTicket.api'
export default {
  props: {
    collectCompanys: { // 揽收公司
      default: () => [],
      type: Array,
      required: false
    },
    saleChannels: { // 平台
      default: () => [],
      type: Array,
      required: false
    },
    shippingmethodss: { // 物流方式
      default: () => [],
      type: Array,
      required: false
    },
    countries: { // 国家
      default: () => [],
      type: Array,
      required: false
    }
  },
  data() {
    return {
      tableLoading: false,
      date2: [], // 时间双向绑定 - 票均成本
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
      type2: 'line',
      button2: '柱状图',
      data: {
        data2: []
      },
      args2: { // 查询参数
        loadDateStart: '', // 	开始日期
        loadDateEnd: '' // 	结束日期
      },
      searForm: { // 票均成本
        loadDateStart: '', // 装车时间-开始
        loadDateEnd: '', // 装车时间-结束
        shippingMethodLevelList: ['M', 'R', 'E'], // 物流级别
        countryList: [], // 国家集合
        saleChannelList: [], // 平台集合
        collectCompanyId: '', // 揽收公司
        shippingMethodCodeList: [] // 物流方式 collectCompanyCode
        // country: '', // 国家
        // saleChannel: '' // 平台
      }
    }
  },
  created() {
    this.date2 = [this.$moment(new Date()).subtract(1, 'M').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')] // 票均成本
    this.assignData()
  },
  methods: {
    // 给数据赋值
    assignData() {
      this.args2.loadDateStart = this.$moment(this.date2[0]).format('YYYY-MM-DD') // 票均成本-开始日期
      this.args2.loadDateEnd = this.$moment(this.date2[1]).format('YYYY-MM-DD')
      this.searForm.loadDateStart = this.$moment(this.date2[0]).format('YYYY-MM-DD') // 票均成本-开始日期-旧接口
      this.searForm.loadDateEnd = this.$moment(this.date2[1]).format('YYYY-MM-DD')
    },
    date2Change(date) {
      this.args2.loadDateStart = date[0] // 票均成本-开始日期
      this.args2.loadDateEnd = date[1]
      this.searForm.loadDateStart = date[0] // 票均成本-开始日期
      this.searForm.loadDateEnd = date[1]
    },
    getFindAverage() { // 票均成本
      if (!this.args2.loadDateStart) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      const _this = this
      _this.tableLoading = true
      // 去掉为空的属性值
      let object = _this.searForm
      for (var key in object) {
        if (object[key] === '' || object[key] === undefined || object[key] === null || object[key].length === 0) {
          // delete object[key]
          object[key] = undefined
        }
      }
      perTicket.getReportList(_this.searForm).then(res => {
        if (res.data.success) {
          let date1 = []
          let date2 = []
          res.data.result.forEach(item2 => {
            item2.loadDate = this.$moment(item2.loadDate).format('YYYY-MM-DD')
            date1.push(item2.loadDate)
            date2 = [...new Set(date1)]
          })
          let temp1Arr = []
          date2.forEach(idx => { // date2是去重完之后的日期
            // { name: '2022-1-1', M: 0, E: 13, R: 10.25 },
            let temp1 = {
              loadDate: idx,
              M: 0,
              E: 0,
              R: 0,
              averageWeightM: 0,
              averageWeightE: 0,
              averageWeightR: 0
            }
            res.data.result.forEach((i, n) => { // 接口的值3.
              if (i.loadDate == idx) { // 当前日期相等时 avWeight
                temp1.loadDate = i.loadDate
                if (i.shippingMethodLevel == 'M') {
                  temp1.M = i.averageShippingCost
                  temp1.averageWeightM = i.avWeight
                }
                if (i.shippingMethodLevel == 'R') {
                  temp1.R = i.averageShippingCost
                  temp1.averageWeightR = i.avWeight
                }
                if (i.shippingMethodLevel == 'E') {
                  temp1.E = i.averageShippingCost
                  temp1.averageWeightE = i.avWeight
                }
              }
            })
            temp1Arr.push(temp1)
          })
          this.data.data2 = temp1Arr
          this.button2 = '柱状图'
          this.initAll()
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取票均成本数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    initAll() {
      this.$nextTick(() => {
        let datas = this.data
        this.initBar2('dom2', { title: '票均成本', data: datas.data2 || [] })
      })
    },
    initBar2(id, data) { // 横向-柱状图 票均成本
      // console.log('initBar2-val', id, this.$cloneDeep(data))
      var chartDom = document.getElementById(id)
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            let dataIndex = params[0].dataIndex // 索引
            let str = ''
            let str2 = ''
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName == '平邮') { // '平邮'  M
                str2 = ' 平均重量：' + (data.data[dataIndex].averageWeightM ? data.data[dataIndex].averageWeightM : 0)
              }
              if (params[i].seriesName == '挂号') { // '挂号'  R
                str2 = ' 平均重量：' + (data.data[dataIndex].averageWeightR ? data.data[dataIndex].averageWeightR : 0)
              }
              if (params[i].seriesName == '快递') { // '快递'  E
                str2 = ' 平均重量：' + (data.data[dataIndex].averageWeightE ? data.data[dataIndex].averageWeightE : 0)
              }
              str += params[i].seriesName + ' ' + params[i].value + str2 + '<br>'
            }
            // console.log(dataIndex, params.length, '票均成本-formatter', params) // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            return `${params.length >= 1 ? params[0].axisValue + '<br>' : ''} ` + `${str}`
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 14
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '时间/天',
          type: 'category',
          data: data.data.map(item => item.loadDate)
        },
        yAxis: {
          name: '票均成本',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '平邮', // M
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.M),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '挂号', // R
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.R),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '快递', // E
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.E),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      if (id == 'dom2') {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      } else {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      }
      option && myChart.setOption(option)
    },
    changeType2(val, id = 'dom2', data = { title: '票均成本', data: this.data.data2 || [] }) { // 修改图表类型 - 票均成本
      // console.log('changeType2-val', val, data)
      let realVal = val === '柱状图' ? 'bar' : 'line'
      this.type2 = realVal
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
            startValue: 0,
            endValue: 14
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '时间/天',
          type: 'category',
          data: data.data.map(item => item.loadDate)
        },
        yAxis: {
          name: '票均成本',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '平邮', // M
            type: this.type2,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.M),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '挂号', // R
            type: this.type2,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.R),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '快递', // E
            type: this.type2,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.E),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        var chartDom = document.getElementById(id)
        this.dom1 = echarts.init(chartDom)
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      })
    },
    resize1() {
      this.dom1.resize()
    }
  }
}
</script>
