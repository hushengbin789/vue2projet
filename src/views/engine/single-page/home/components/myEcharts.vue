<template>
  <div>
    <Row>
      <Col span="3" v-if="args1.isDate || args1.isCollectCompany || (args1.collectCompanyCode&&args1.isShippingMethod ) || (args1.collectCompanyCode&&args1.isCountry)">
        <div style="display: flex;align-items: center;"  v-show="IsDate">
          <div style="width: 74px;">揽收公司:</div>
          <div>
            <Select v-model="args1.collectCompanyCode" clearable filterable placeholder="请输入揽收公司"
              :disabled='args1.isShippingMethod || args1.isCountry'>
              <Option v-for="item in collectCompanys" :value="item.label||''" :key="item.val">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="3" style="margin: 0 6px;" v-if="args1.isDate ||args1.isSalechannel || (args1.salechannel&&args1.isShippingMethod) || (args1.salechannel&&args1.isCountry)">
        <div style="display: flex;align-items: center;" v-show="IsDate">
          <div style="width: 56px;">平台:</div>
          <div>
            <Select v-model="args1.salechannel" @on-change="salechannelChange($event)" clearable filterable placeholder="请选择"
              :disabled='args1.isShippingMethod || args1.isCountry' >
                <Option v-for="item in saleChannels" :value="item.code||''" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" v-if="!shippingMethodFilter" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;" v-show="IsDate">
          <div style="width: 74px;">物流方式1:</div>
          <div class="xxxx4" style="width: 216px;">
            <Select style="width: 100%;" v-model="args1.shippingMethodCodeList" multiple :max-tag-count="1" clearable filterable placeholder="请选择物流方式1"
              :disabled='args1.isCountry'>
              <Option v-for="item in shippingmethodss" :value="item.code||''" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" v-if="shippingMethodFilter">
        <div style="display: flex;align-items: center;" v-show="IsDate">
          <div style="width: 74px;">物流方式2:</div>
          <div class="xxxx4" style="width: 216px;">
            <Select v-model="args1.shippingMethodCodeList" clearable filterable  :disabled="args1.isCountry"
              multiple :max-tag-count="1"  placeholder="请选择物流方式2" >
              <Option v-for="(item) in shippingmethodss2" :value="item.code || ''" :key="item.id" >{{ item.code }}~{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </Col>
      <Col span="1">
        <div style="display: flex;justify-content: center;height: 30px;align-items: center;">
          <Checkbox v-model="shippingMethodFilter" style="font-size: 14px;" @on-change="shippingMethodFilterChange">筛选</Checkbox>
        </div>
      </Col>
      <Col span="2" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;" v-show="IsDate">
          <div style="width: 56px;">国家:</div>
          <div>
            <Select v-model="args1.country"  clearable filterable placeholder="请选择国家">
              <Option v-for="(item, key) in countries" :value="item.twowordname || ''" :key="item.twowordname + `_${key}`">{{item.chinesename1}}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="2">
        <div style="display: flex;align-items: center;" >
          <div style="width: 60px;">级别:</div>
          <div >
            <Select v-model="args1.shippingLevel"  clearable filterable placeholder="请选择">
                <Option value="M">平邮</Option>
                <Option value="R">挂号</Option>
                <Option value="E">快递</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" style="margin-left: 10px;">
        <div style="display: flex;align-items: center;" v-show="IsDate">
          <div style="width: 74px;">装车时间:</div>
          <div style="width: 180px;">
            <DatePicker v-model="date" :options="options2" @on-change="date1Change($event)" type="daterange" placement="bottom-end" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <!-- 隐藏近一周和本月单选功能 -->
      <!-- <Col style="text-align: left;display: inline-block;padding-right: 20px;">
        <div style="margin: 0 10px;">
          <RadioGroup v-model="button1_1" style="float: left;" type="button" @on-change="changeType1_1" >
            <Radio label="近一周" border></Radio>
            <Radio label="本月" border></Radio>
          </RadioGroup>
        </div>
      </Col> -->
      <Col style="margin-left: 20px;display: inline-block;">
        <Button type="primary" @click="getDeliverySummary" :loading="tableLoading"  v-show="IsDate">查询</Button>
        <span>&nbsp;</span>
      </Col>
      <Col style="text-align: left;display: inline-block;">
        <div v-show="IsDate" >
          <RadioGroup v-model="button1"  @on-change="changeType1">
            <Radio label="柱状图" size="default" border></Radio>
            <Radio label="折线图" size="default" border></Radio>
          </RadioGroup>
        </div>
        <span v-show="IsDate == false"><div style="width: 188px;">&nbsp;</div></span>
      </Col>
    </Row>
    <Row>
      <Col  style="text-align: left;display: inline-block;" >
        <div style="position: relative;top: -11px;left: 20px;margin: 12px 0;">
          <Button v-if="args1.isDate|| args1.isCollectCompany|| (args1.collectCompanyCode&&args1.isShippingMethod)|| (args1.collectCompanyCode&&args1.isCountry)"
            @click="isSalechannelChange" :loading="tableLoading" type="warning">按平台</Button>&nbsp;
          <Button style="margin-right: 10px;" v-if="args1.isSalechannel || args1.isCollectCompany || args1.isShippingMethod|| args1.isCountry"
            @click="isDateChange" :loading="tableLoading" type="warning">按日期</Button>
          <Button style="margin-right: 10px;" v-if="args1.isDate ||args1.isSalechannel|| (args1.salechannel&&args1.isShippingMethod)|| (args1.salechannel&&args1.isCountry)"
            @click="isCollectCompanyChange" :loading="tableLoading" type="warning">按揽收公司</Button>
        </div>
      </Col>
      <Col  style="text-align: left;display: inline-block;" v-if="args1.isDate ||args1.isSalechannel || args1.isShippingMethod || args1.isCountry">
        <div style="position: relative;top: -11px;left: 20px;margin: 12px 0;">
          <Button type="success" style="margin-right: 10px;" v-if="args1.isShippingMethod || args1.isCountry" @click="goBack" :loading="tableLoading" >返回上一步</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <!-- <div ref="dom1" style="height: 500px;margin-top: 10px;"></div> -->
      <div id="collect1" class="chart-box" style="height: 490px;margin-top: 10px;"></div>
    </Row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { on } from '@/libs/tools'
import * as commonOpr from '@/api/common.api'
import * as home from '@/api/home.api.js'
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
    onShippingmethodObjs: { // 已启用物流方式
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
      type: 'line',
      type1: 'line',
      platformIsDate: '按平台',
      args1Title: '发货汇总',
      shippingmethodss2: [],
      shippingMethodFilter: false, // 筛选物流方式
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
              const now = new Date() // 当前日期
              const nowDay = now.getDate() // 当前日
              const nowMonth = now.getMonth() // 当前月
              let nowYear = now.getYear() // 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0 //
              // 格局化日期：yyyy-MM-dd
              function formatDate(date) {
                const myyear = date.getFullYear()
                let mymonth = date.getMonth() + 1
                let myweekday = date.getDate()

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
                const monthStartDate1 = new Date(nowYear, nowMonth, 1)
                const str = formatDate(monthStartDate1)
                return str
              }
              // 获得本月的停止日期
              function getMonthEndDate() {
                const monthEndDate1 = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
                const str = formatDate(monthEndDate1)
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
      mapp: {},
      button1_1: '近一周',
      button1: '柱状图',
      date: [], // 时间双向绑定 - 发货汇总
      args1: { // 查询参数-发货汇总
        collectCompanyCode: '', // 揽收公司代码
        salechannel: '', // 平台
        shippingMethodCode: '', // 物流方式代码
        shippingMethodCodeList: [], // 物流方式代码集合
        country: '', // 国家
        dateFrom: '', // 	开始日期
        dateTo: '', // 	结束日期
        shippingLevel: '', // 		级别
        isSalechannel: false, // 		是否按平台统计
        isCollectCompany: false, // 	是否按揽收公司统计
        isShippingMethod: false, // 	是否按物流方式统计
        isCountry: false, // 	是否按国家统计
        isDate: true // 	是否按日期统计
      },
      IsDate: true,
      tableLoading: false,
      data: {
        storyPointBarGraph: [
          { name: '2021-12-20', value: null, front: 13, back: 10.25, test: null },
          { name: '2021-12-27', value: null, front: 1.9545454545454546, back: 7.75, test: null },
          { name: '2022-1-4', value: null, front: 3.9545454545454546, back: 5.75, test: null },
          { name: '2022-1-11', value: null, front: 2.9545454545454546, back: 9.75, test: null }
        ],
        data1: []
      },
      echarts_data: []
    }
  },
  created() {
    this.date = [this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')] // 发货汇总
    this.args1.dateFrom = this.$moment(this.date[0]).format('YYYY-MM-DD') // 发货汇总-开始日期
    this.args1.dateTo = this.$moment(this.date[1]).format('YYYY-MM-DD')
    this.getDeliverySummary2()
    this.shippingMethodFilterChange(true)
  },
  methods: {
    shippingMethodFilterChange(val) { // 是否筛选物流方式
      console.log('是否筛选物流方式1', val, this.onShippingmethodObjs)
      this.shippingMethodFilter = val
      if (val === false) return
      if (this.shippingMethodFilter) {
        this.args1.shippingMethodCodeList = []
      }
      this.shippingmethodss2 = this.onShippingmethodObjs
    },
    getDeliverySummary2() { // 显示物流方式
      commonOpr.getAllShippingmethodss().then(res => { // 获取物流方式
        const obj = res.data.result
        const map = new Map(Object.entries(obj))
        this.mapp = map
      }).catch(function(err) {
        console.log(err)
      })
    },
    salechannelChange(val) { // 选择平台查询
      this.args1.salechannel = val
    },
    date1Change(date) { // 选择时间查询
      this.args1.dateFrom = date[0] // 发货汇总-开始日期
      this.args1.dateTo = date[1]
      this.getDeliverySummary()
    },
    getDeliverySummary() { // 发货汇总
      if (!this.args1.dateFrom) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      // console.log('args1', this.$cloneDeep(this.args1))
      const _this = this
      _this.tableLoading = true
      home.getFindDeliverySummary(this.args1).then(res => {
        if (res.data.success) {
          if (this.args1.isDate == true) { // 按日期
            res.data.result.forEach(item => {
              item.date = this.$moment(item.date).format('YYYY-MM-DD')
            })
            this.data.data1 = res.data.result || []
            this.args1Title = '发货汇总'
            this.button1 = '柱状图'
            this.initAll()
          }
          if (this.args1.isSalechannel == true) { // 按平台
            res.data.result.forEach(item => {
              item.date = item.salechannel
            })
            this.data.data1 = res.data.result || []
            this.args1Title = '平台汇总'
            this.button1 = '柱状图'
            this.initAll()
          }
          if (this.args1.isCollectCompany) { // 按揽收公司
            res.data.result.forEach(item => {
              item.date = item.collectCompanyCode
            })
            this.data.data1 = res.data.result || []
            this.args1Title = '揽收公司汇总'
            this.button1 = '柱状图'
            this.initAll()
          }
          if (this.args1.isShippingMethod) { // 按物流方式
            res.data.result.forEach(item => {
              item.date = item.shippingMethodCode
            })
            this.data.data1 = res.data.result || []
            this.args1Title = '物流方式汇总'
            this.button1 = '柱状图'
            this.initAll()
          }
          if (this.args1.isCountry) { // 按国家 shortname
            res.data.result.forEach(item => {
              _this.countries.forEach(id => {
                if (item.country == id.twowordname) {
                  item.date = id.twowordname + '-' + id.chinesename
                }
              })
            })
            this.data.data1 = res.data.result || []
            this.args1Title = '国家汇总'
            this.button1 = '柱状图'
            this.initAll()
          }
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取发货汇总数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    initAll() {
      this.$nextTick(() => {
        const datas = this.data
        if (this.args1.isDate) {
          this.initBar('collect1', { title: '发货汇总', data: datas.data1 || [] })
        }
        if (this.args1.isSalechannel) {
          this.initBar1_1('collect1', { title: '平台汇总', data: datas.data1 || [] })
        }
        if (this.args1.isShippingMethod) {
          this.initBar1_2('collect1', { title: '物流方式汇总', data: datas.data1 || [] })
        }
        if (this.args1.isCountry) {
          this.initBar1_3('collect1', { title: '国家汇总', data: datas.data1 || [] })
        }
        if (this.args1.isCollectCompany) {
          this.initBar1_4('collect1', { title: '揽收公司汇总', data: datas.data1 || [] })
        }
      })
    },
    isSalechannelChange() { // 按平台
      // console.log('按平台')
      this.args1.collectCompanyCode = ''
      this.args1.shippingMethodCodeList = []
      this.args1.isSalechannel = true // 		是否按平台统计
      this.args1.isCollectCompany = false // 	是否按揽收公司统计
      this.args1.isShippingMethod = false // 	是否按物流方式统计
      this.args1.isCountry = false // 	是否按国家统计
      this.args1.isDate = false // 	是否按日期统计
      this.getDeliverySummary()
    },
    isCollectCompanyChange() { // 按揽收公司
      // console.log('按揽收公司')
      this.args1.salechannel = ''
      this.args1.shippingMethodCodeList = []
      this.args1.isSalechannel = false // 		是否按平台统计
      this.args1.isCollectCompany = true // 	是否按揽收公司统计
      this.args1.isShippingMethod = false // 	是否按物流方式统计
      this.args1.isCountry = false // 	是否按国家统计
      this.args1.isDate = false // 	是否按日期统计
      this.getDeliverySummary()
    },
    isDateChange() { // 是否按日期统计
      // console.log('按日期')
      this.args1.collectCompanyCode = ''
      this.args1.shippingMethodCode = ''
      this.args1.shippingMethodCodeList = []
      this.args1.salechannel = ''
      this.args1.country = ''
      this.args1.isSalechannel = false
      this.args1.isCollectCompany = false
      this.args1.isShippingMethod = false
      this.args1.isCountry = false
      this.args1.isDate = true
      this.getDeliverySummary()
    },
    goBack() { // 返回上一步
      if (this.args1.isShippingMethod) { // 平台返回
        // 这里有两种返回方式 平台返回 | 揽收公司返回
        if (this.args1.collectCompanyCode) {
          // console.log('揽收公司返回')
          this.args1.isCollectCompany = true
          this.args1.isSalechannel = false
          this.args1.isShippingMethod = false
          this.args1.salechannel = ''
          this.args1.shippingMethodCode = ''
          this.args1.shippingMethodCodeList = []
          this.args1.collectCompanyCode = ''
          this.getDeliverySummary()
        }
        if (this.args1.salechannel) {
          // console.log('平台返回')
          this.args1.isSalechannel = true
          this.args1.isCollectCompany = false
          this.args1.isShippingMethod = false
          this.args1.salechannel = ''
          this.args1.collectCompanyCode = ''
          this.args1.shippingMethodCode = ''
          this.args1.shippingMethodCodeList = []
          this.getDeliverySummary()
        }
      } else if (this.args1.isCountry) { // 物流方式返回
        this.args1.isShippingMethod = true
        this.args1.isCountry = false
        this.args1.shippingMethodCode = ''
        this.args1.shippingMethodCodeList = []
        this.getDeliverySummary()
      }
    },
    // 横向-柱状图 - 发货汇总 -  按日期
    initBar(id, data) {
      // console.log('val', id, data)
      const chartDom = document.getElementById(id)
      const myChart = echarts.init(chartDom)
      const option = {
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
            // let dataIndex = params[0].dataIndex // 索引
            // let axisValue1 = params[0].axisValue // 标题
            // let name1 = ''
            // let name2 = ''
            // let name3 = ''
            let str = ''
            for (let i = 0; i < params.length; i++) {
              str += params[i].seriesName + ' ' + params[i].value + '<br>'
            }
            /* if (params.length == 1) { // 只显示一个
              // if (params[0].seriesName == '票量') { // '票量'
              //   name1 = params[0].seriesName + ' ' + params[0].value
              // } else if (params[0].seriesName == '重量') { // '重量'
              //   name1 = params[0].seriesName + ' ' + params[0].value
              // } else if (params[0].seriesName == '平均重量') { // '平均重量'
              //   name1 = params[0].seriesName + ' ' + params[0].value
              // }

              // str = axisValue1 + '<br>' + name1
            } else if (params.length == 2) { // 只显示两个
              if (params[0].seriesName == '票量' && params[1].seriesName == '重量') { // '票量' 重量
                name1 =  params[0].axisValue.seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '重量' && params[1].seriesName == '平均重量') { // '重量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '票量' && params[1].seriesName == '平均重量') { // '票量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else {
                name1 = ''
                name2 = ''
              }
              str = axisValue1 + '<br>' + name1 + '<br>' + name2
            } else if (params.length == 3) { // 三个全部显示
              name1 = params[0].seriesName + ' ' + params[0].value
              name2 = params[1].seriesName + ' ' + params[1].value
              name3 = params[2].seriesName + ' ' + params[2].value
              str = axisValue1 + '<br>' + name1 + '<br>' + name2 + '<br>' + name3
            } else {
              str = ''
            } */
            // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            // console.log(dataIndex, params.length, data.data[dataIndex], '发货汇总-formatter', params, 'name1', name1)
            return params[0].axisValue + '<br>' + str
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
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
          data: data.data.map(item => item.date)
        },
        yAxis: {
          name: '票量/重量',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '票量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            // data: data.data.map(item => this.toFixed(item.totalWeight)),
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        // this.dom = echarts.init(this.$refs.dom)
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      })
      const that = this
      // 3、在渲染点击事件之前先清除点击事件
      myChart.getZr().off('click')
      myChart.getZr().on('mousemove', param => {
        const pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          const option = myChart.getOption()
          const xAxis = option.xAxis
          const name = xAxis[0].data[xIndex]
          if (name != undefined || name == '') {
            that.$router.push({ // 跳转发货汇总统计
              name: 'collect',
              params: {
                month: name || '',
                level: that.args1.shippingLevel,
                shippingCompanyCode: that.args1.collectCompanyCode
              }
            })
          }
        }
      })
    },
    // 横向-柱状图 - 发货汇总-平台
    initBar1_1(id, data) {
      // console.log('val-initBar1_1', id, data)
      const chartDom = document.getElementById(id)
      if (!chartDom) return
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          left: 'center',
          text: data.title == '平台汇总' ? '平台汇总' : '物流方式汇总'
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
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: data.title == '平台汇总' ? '平台' : '物流方式',
          type: 'category',
          data: data.data.map(item => item.date)
        },
        yAxis: {
          name: '票量/重量',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '票量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      const that = this
      // 1、清除画布
      myChart.clear()
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')

      myChart.getZr().off('click')
      myChart.getZr().on('mousemove', param => {
        const pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          const option = myChart.getOption()
          const xAxis = option.xAxis
          const name = xAxis[0].data[xIndex]
          if (that.args1.isSalechannel && name) { // 平台汇总
            that.args1.salechannel = name
            that.args1.isSalechannel = false
            that.args1.isShippingMethod = true
            that.getDeliverySummary()
          }
          // console.log('阴影', xIndex, 'option', option, 'xAxis', xAxis, xAxis[0].data[xIndex])

          // 1、清除画布
          myChart.clear()
          myChart.setOption(option)
        }
      })
      this.$nextTick(() => {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      })
    },
    // 横向-柱状图 - 发货汇总-物流方式
    initBar1_2(id, data) {
      // console.log('val', id, data)
      const chartDom = document.getElementById(id)
      if (!chartDom) return
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          left: 'center',
          text: data.title == '平台汇总' ? '平台汇总' : '物流方式汇总'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            // let dataIndex = params[0].dataIndex // 索引
            const axisValue1 = params[0].axisValue // 标题 axisValue
            let name1 = ''
            let name2 = ''
            let name3 = ''
            let str = ''
            const title = this.mapp.get(axisValue1)
            if (params.length == 1) { // 只显示一个
              if (params[0].seriesName == '票量') { // '票量'
                name1 = params[0].value
              } else if (params[0].seriesName == '重量') { // '重量'
                name1 = params[0].value
              } else if (params[0].seriesName == '平均重量') { // '平均重量'
                name1 = params[0].value
              }
              str = title + '<br>' + params[0].seriesName + ' ' + name1
            } else if (params.length == 2) { // 只显示两个
              if (params[0].seriesName == '票量' && params[1].seriesName == '重量') { // '票量' 重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '重量' && params[1].seriesName == '平均重量') { // '重量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '票量' && params[1].seriesName == '平均重量') { // '票量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else {
                name1 = ''
                name2 = ''
              }
              str = title + '<br>' + name1 + '<br>' + name2
            } else if (params.length == 3) { // 三个全部显示
              name1 = params[0].seriesName + ' ' + params[0].value
              name2 = params[1].seriesName + ' ' + params[1].value
              name3 = params[2].seriesName + ' ' + params[2].value
              str = title + '<br>' + name1 + '<br>' + name2 + '<br>' + name3
            } else {
              str = ''
            }
            // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            // console.log(dataIndex, params.length, data.data[dataIndex], axisValue1, '发货汇总-formatter', params, this.shippingmethodss, '方式', this.mapp.get(axisValue1))
            return str
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: data.title == '平台汇总' ? '平台' : '物流方式',
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
            // rotate: '50',
            lineHeight: 18,
            formatter: function(params) {
              // console.log('formatter', params, params.length)
              let newParamsName = ''// 最终拼接成的字符串
              const paramsNameNumber = params.length// 实际标签的个数
              const provideNumber = 6// 每行能显示的字的个数
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
          data: data.data.map(item => item.date)
        },
        yAxis: {
          name: '票量/重量',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '票量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        if (id == 'dom2') {
          this.dom1 = myChart
          this.dom1.setOption(option)
          on(window, 'resize', this.resize1())
        } else {
          this.dom1 = myChart
          this.dom1.setOption(option)
          on(window, 'resize', this.resize1())
        }
      })
      const that = this
      // 1、清除画布
      myChart.clear()
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')
      myChart.getZr().off('click')

      myChart.getZr().on('mousemove', param => {
        const pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          const option = myChart.getOption()
          const xAxis = option.xAxis
          const name = xAxis[0].data[xIndex]
          if (that.args1.isShippingMethod && name) { // 物流方式汇总
            that.args1.isCountry = true
            that.args1.isSalechannel = false
            that.args1.isShippingMethod = false
            that.args1.shippingMethodCodeList.push(name) /// -----
            that.getDeliverySummary()
          }

          // 1、清除画布
          myChart.clear()
          // console.log('阴影', xIndex, 'option', option,  'xAxis', xAxis, xAxis[0].data[xIndex])
          myChart.setOption(option)
        }
      })
    },
    // 横向-柱状图 - 发货汇总-国家汇总
    initBar1_3(id, data) {
      // console.log('val', id, data)
      const chartDom = document.getElementById(id)
      const myChart = echarts.init(chartDom)
      const option = {
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
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '国家',
          type: 'category',
          data: data.data.map(item => item.date)
        },
        yAxis: {
          name: '票量/重量',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '票量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        // 1、清除画布
        myChart.clear()
        // 3、在渲染点击事件之前先清除点击事件
        myChart.off('click')
        myChart.getZr().off('click')
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      })
    },
    // 横向-柱状图 - 发货汇总-揽收公司
    initBar1_4(id, data) {
      // console.log('val-initBar1_4', id, data)
      const chartDom = document.getElementById(id)
      if (!chartDom) return
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          left: 'center',
          text: data.title == '揽收公司汇总' ? '揽收公司汇总' : '----'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            const dataIndex = params[0].dataIndex // 索引
            const axisValue1 = params[0].axisValue // 标题
            let name1 = ''
            let name2 = ''
            let name3 = ''
            let str = ''
            if (params.length == 1) { // 只显示一个
              if (params[0].seriesName == '票量') { // '票量'
                name1 = params[0].seriesName + ' ' + params[0].value
              } else if (params[0].seriesName == '重量') { // '重量'
                name1 = params[0].seriesName + ' ' + params[0].value
              } else if (params[0].seriesName == '平均重量') { // '平均重量'
                name1 = params[0].seriesName + ' ' + params[0].value
              }
              str = axisValue1 + '-' + data.data[dataIndex].collectCompanyName + '<br>' + name1
            } else if (params.length == 2) { // 只显示两个
              if (params[0].seriesName == '票量' && params[1].seriesName == '重量') { // '票量' 重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '重量' && params[1].seriesName == '平均重量') { // '重量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else if (params[0].seriesName == '票量' && params[1].seriesName == '平均重量') { // '票量'  平均重量
                name1 = params[0].seriesName + ' ' + params[0].value
                name2 = params[1].seriesName + ' ' + params[1].value
              } else {
                name1 = ''
                name2 = ''
              }
              str = axisValue1 + '-' + data.data[dataIndex].collectCompanyName + '<br>' + name1 + '<br>' + name2
            } else if (params.length == 3) { // 三个全部显示
              name1 = params[0].seriesName + ' ' + params[0].value
              name2 = params[1].seriesName + ' ' + params[1].value
              name3 = params[2].seriesName + ' ' + params[2].value
              str = axisValue1 + '-' + data.data[dataIndex].collectCompanyName + '<br>' + name1 + '<br>' + name2 + '<br>' + name3
            } else {
              str = ''
            }
            // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            // console.log(dataIndex, params.length, data.data[dataIndex], '发货汇总-formatter', params, 'name1', name1)
            return str
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: data.title == '揽收公司汇总' ? '揽收公司' : '---',
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
            // rotate: '50',
            lineHeight: 18,
            formatter: function(params) {
              // console.log('formatter', params, params.length)
              let newParamsName = ''// 最终拼接成的字符串
              const paramsNameNumber = params.length// 实际标签的个数
              const provideNumber = 6// 每行能显示的字的个数
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
          data: data.data.map(item => item.date)
        },
        yAxis: {
          name: '票量/重量',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '票量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      })
      const that = this
      // 1、清除画布
      myChart.clear()
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')

      myChart.getZr().off('click')
      myChart.getZr().on('mousemove', param => {
        const pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          const option = myChart.getOption()
          const xAxis = option.xAxis
          const name = xAxis[0].data[xIndex]
          if (that.args1.isCollectCompany && name) { // 揽收公司
            that.args1.collectCompanyCode = name
            that.args1.isCollectCompany = false
            that.args1.isShippingMethod = true
            that.getDeliverySummary()
          }
          console.log('阴影', xIndex, 'option', option, 'xAxis', xAxis, name)
          myChart.clear() // 1、清除画布
          myChart.setOption(option)
        }
      })
    },
    changeType1(val, id = 'collect1', data = { title: this.args1Title, data: this.data.data1 || [] }) { // 修改图表类型 - 发货汇总
      // console.log('val', val, this.data.data1, 'data:', data)
      const realVal = val === '柱状图' ? 'bar' : 'line'
      this.type1 = realVal
      const option = {
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
            endValue: 7
          },
          {
            type: 'inside'
          }
        ],
        legend: {
          left: 'right',
          selected: {
            // 选中'票量'
            票量: true,
            // 不选中'重量' 平均重量
            重量: false,
            平均重量: false
          },
          top: 'top'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.data.map(item => item.date)
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        yAxis: {
          type: 'value',
          axisLine: { // x轴坐标轴
            show: false
          },
          axisTick: {		// x轴刻度线
            show: false
          },
          boundaryGap: [0, 0.01]
        },
        series: [
          {
            name: '票量',
            type: this.type1,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalCount),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '重量',
            type: this.type1,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.totalWeight),
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '平均重量',
            type: this.type1,
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.avWeight),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.$nextTick(() => {
        const chartDom = document.getElementById(id)
        this.dom1 = echarts.init(chartDom)
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
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
