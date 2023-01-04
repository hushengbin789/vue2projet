<template>
  <div>
    <Row>
      <Col span="4" style="margin: 0 6px;" v-show="!problemStatus6">
        <div style="display: flex;align-items: center;">
          <div style="width: 90px;">物流商简称:</div>
          <div>
            <Select v-model="args6.shippingCompanyId"  clearable filterable placeholder="请选择物流商">
              <Option v-for="(item, key) in pullLogisticsShortName" :value="key" :key="key">{{ item }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" v-if="!shippingMethodFilter" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;" v-show="!problemStatus6">
          <div style="width: 74px;">物流方式:</div>
          <div  style="width: 216px;">
            <Select v-model="args6.shippingMethodId" clearable filterable placeholder="请选择物流方式">
              <Option v-for="(item, key) in getshippingmethodsId" :value="key" :key="key">{{ item }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" v-if="shippingMethodFilter">
        <div style="display: flex;align-items: center;" v-show="!problemStatus6">
          <div style="width: 74px;">物流方式:</div>
          <div style="width: 216px;">
            <Select v-model="args6.shippingMethodId" clearable filterable  placeholder="请选择物流方式" >
              <Option v-for="(item) in shippingmethodss2" :value="item.id || ''" :key="item.id" >{{ item.code }}~{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </Col>
      <Col span="1" v-show="!problemStatus6">
        <div style="display: flex;justify-content: center;height: 30px;align-items: center;">
          <Checkbox v-model="shippingMethodFilter" style="font-size: 14px;" @on-change="shippingMethodFilterChange">筛选</Checkbox>
        </div>
      </Col>
      <Col span="4" style="margin-left: 10px;">
        <div style="display: flex;align-items: center;" v-show="!problemStatus6">
          <div style="width: 74px;">装车时间:</div>
          <div style="width: 180px;">
            <DatePicker v-model="date6" type="month" @on-change="date6Change($event)" placement="bottom-end" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4" style="margin: 0 6px;">
        <div style="display: flex;align-items: center;" v-show="!problemStatus6">
          <div style="width: 120px;">问题类型细分:</div>
          <div class="xxxx4">
            <Select v-model="typesInfo6" multiple :max-tag-count="1"  clearable filterable placeholder="请选择">
              <Option v-for="(item,idx) in problemType" :value="idx" :key="idx+'_1'">{{ idx }}</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col span="4">
        <div style="display: flex;align-items: center;" v-show="!problemStatus6">
          <div style="width: 74px;">处理状态:</div>
          <div class="xxxx4">
            <Select v-model="status6" multiple :max-tag-count="1"  clearable filterable >
              <Option value="0">未解决</Option>
              <Option value="1">解决中</Option>
              <Option value="2">已解决</Option>
            </Select>
          </div>
        </div>
        <span>&nbsp;</span>
      </Col>
      <Col style="margin-left: 14px;display: inline-block;">
        <Button type="primary" @click="getProblemStatistics" :loading="tableLoading"  v-show="!problemStatus6">查询</Button>
        <span>&nbsp;</span>
        <div v-if="problemStatus6" style="width: 260px;height: 2px;"></div>
      </Col>
      <Col  style="text-align: left;display: inline-block;margin-left: 10px;" v-if="problemStatus6">
        <div style="position: relative;right: 0px;">
          <Button type="success"  @click="goBack6" :loading="tableLoading" >返回上一步</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <div  id="dom6" v-if="!initBar6lent"  class="qqqq chart-box" style="height: 540px;margin-top: 10px;"></div>
      <div  v-if="initBar6lent"  class="wwww" style="height: 540px;margin-top: 10px;background-color: #fff;text-align: center;line-height: 540px;">
        暂无数据
      </div>
      <div class="table-container" v-if="!initBar6lent">
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">&nbsp;</th>
              <th v-for="(item, idx) in initBar6shortName" :key="idx" style="width: auto;">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr  v-for="(item, idx) in initBar6data" :key="idx">
              <td>{{ item.name }}</td>
              <td v-for="(item2, idx2) in item.data" :key="idx2">{{ item2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { on } from '@/libs/tools'
import * as home from '@/api/home.api.js'
import * as questionApi from '@/api/questionManagement.api.js'
export default {
  props: {
    getshippingmethodsId: { // 物流方式
      default: () => {},
      type: Object,
      required: false
    },
    onShippingmethodObjs: { // 已启用物流方式
      default: () => [],
      type: Array,
      required: false
    }
  },
  data() {
    return {
      initBar6Temp: [], // 日期存储
      type: 'line',
      shippingmethodss2: [],
      shippingMethodFilter: false, // 筛选物流方式
      args6: { // 查询参数
        shippingCompanyId: '', // 	物流商ID
        shippingMethodId: '', // 	物流方式id
        loadTime: '', // 	装车时间 yyyy-mm
        problemTypesInfo: '', // 	问题类型细分,多个英文逗号分割
        processingStatus: '' // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
      },
      args6_2_title: '',
      args6_2: { // 查询参数
        shippingCompanyId: '', // 	物流商ID
        shippingMethodId: '', // 	物流方式id
        loadTime: '', // 	装车时间 yyyy-mm
        problemTypesInfo: '', // 	问题类型细分,多个英文逗号分割
        processingStatus: '' // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
      },
      date6: '', // 时间双向绑定 - 问题件统计
      typesInfo6: '', // 问题类型细分 - 问题件统计
      status6: ['0'], // 处理状态 - 问题件统计
      problemType: {}, // 问题类型细分
      problemStatus6: false,
      initBar6lent: true,
      initBar6data: null,
      initBar6shortName: [],
      tableLoading: false,
      data: {
        data6: [],
        data6_2: [] // 问题件统计-细分
      }
    }
  },
  created() {
    this.getfindSelectShortName() // 物流商简称
    this.args6.loadTime = this.$moment().format('YYYY-MM') // 问题件统计
    this.date6 = this.$moment().format('YYYY-MM') // 问题件统计
    this.shippingMethodFilterChange(true)
  },
  methods: {
    shippingMethodFilterChange(val) { // 是否筛选物流方式
      this.shippingMethodFilter = val
      if (val === false) return
      if (this.shippingMethodFilter) {
        this.args6.shippingMethodId = ''
      }
      this.shippingmethodss2 = this.onShippingmethodObjs
    },
    goBack6() { // 问题件统计-细分
      if (this.problemStatus6) {
        this.args6.shippingCompanyId = ''
        this.args6.shippingMethodId = ''
        this.args6.problemTypesInfo = ''
        this.args6.processingStatus = ''
        this.typesInfo6 = ''// 问题类型细分
        this.status6 = '' // 处理状态
        this.problemStatus6 = false
        this.getProblemStatistics()
      }
    },
    getProblemTypes() { // 问题件统计-细分
      const _this = this
      questionApi.findSelectValuesType({ problemTypes: '' }).then(res => {
        if (res.data.success) {
          _this.problemType = res.data.result || {}
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取问题件统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    date6Change(date) { // 选择时间查询
      this.date6 = date != '' ? this.$moment(date).format('YYYY-MM') : ''
      this.args6.loadTime = date != '' ? this.$moment(date).format('YYYY-MM') : ''
      this.getProblemStatistics()
    },
    getProblemStatistics() { // 问题件统计
      if (!this.args6.loadTime) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      let tempStatus6 = this.status6 && this.status6.join(',')
      let tempTypesInfo6 = this.typesInfo6 && this.typesInfo6.join(',')
      this.args6.processingStatus = tempStatus6
      this.args6.problemTypesInfo = tempTypesInfo6
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      const _this = this
      _this.tableLoading = true
      home.getProblemStatistics(this.args6).then(res => {
        if (res.data.success) {
          _this.data.data6 = res.data.result ? res.data.result : {}
          _this.initAll6()
          console.log('问题件统计', res, this.status6)
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取问题件统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    getProblemStatisticsType() { // 首页问题件统计细分详情
      if (!this.args6.loadTime) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      const _this = this
      _this.tableLoading = true
      home.getProblemStatisticsType(this.args6_2).then(res => {
        if (res.data.success) {
          _this.data.data6_2 = res.data.result ? res.data.result : {}
          _this.initAll6_2()
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取问题件统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    initAll6() {
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data6).length == 0) {
          this.initBar6lent = true
        } else {
          this.initBar6lent = false
          setTimeout(() => {
            this.initBar6('dom6', { title: '各物流商异常件分析', data: datas.data6 || {} })
          }, 300)
        }
      })
    },
    initAll6_2() {
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data6_2).length == 0) {
          this.initBar6lent = true
        } else {
          this.initBar6lent = false
          setTimeout(() => {
            this.initBar6_2('dom6', { title: `${this.args6_2_title}  物流商异常件分析`, data: datas.data6_2 || {} })
          }, 300)
        }
      })
    },
    initBar6(id, data) { // 横向-柱状图 问题件统计
      console.log('initBar6-val', id, data)
      let seriesValue = []
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      console.log(this.$cloneDeep(data.data), 'item--0', typeof data.data)
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let resultarr = []
      if (data) {
        let temp = Object.freeze(data.data)
        // console.log(Object.keys(temp).length, 'temp--233', temp)

        let arr1 = []
        let arr2 = []
        this.initBar6Temp = []
        if (Object.keys(temp).length == 0) {
          resultarr = []
          arr1 = []
          arr2 = []
          this.initBar6lent = true
          // console.log(0, 'length--0has哈哈哈', 'initBar6lent:', this.initBar6lent)
          seriesValue = []
          data.data = {}
          this.initBar6data = null
          this.initBar6shortName = []
        } else {
          seriesValue = []
          this.initBar6lent = false
          if (temp.shippingCompany0) {
            this.initBar6Temp = temp.shippingCompany0.map(item => item.loadMonth)
          }
          seriesValue = this.initBar6Temp.map((key, index) => {
            return {
              name: key,
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              barMaxWidth: 36, // 柱图宽度
              data: Object.keys(temp).map(key1 => temp[key1][index].problemCount)
            }
          })
          this.initBar6data = seriesValue
          Object.keys(temp).forEach((key, idx) => {
            temp[key].forEach((item, idx1) => {
              arr1.push(item.shortName)
              arr2.push(item.shippingCompanyName) // 物流商全称
              resultarr = [...new Set(arr1)]
            })
          })
          this.initBar6shortName = resultarr // 物流商简称
          console.log('seriesValue--物流商简称', seriesValue, resultarr, 'temp', temp)
          // console.log('arr1-物流商简称', arr1, 'arr2-物流商全称', arr2)
        }
      } else {
        console.log('seriesValue--else')
      }
      var option = {
        title: {
          top: '0%',
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
            endValue: 6
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        legend: {
          top: '4%',
          right: '8%'
        },
        grid: {
          left: '3%',
          right: '6%',
          // bottom: '20%',
          containLabel: true
        },
        xAxis: {
          name: '物流商简称',
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
          name: '件数',
          type: 'value'
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
        series: seriesValue
      }
      this.$nextTick(() => {
        if (id == 'dom6') {
          this.dom1 = myChart
          this.dom1.setOption(option)
          on(window, 'resize', this.resize1())
        } else {
          this.dom1 = myChart
          this.dom1.setOption(option)
          on(window, 'resize', this.resize1())
        }
      })

      /** ************ */
      let that = this
      // 1、清除画布
      myChart.clear()
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')
      myChart.getZr().off('click')
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
          let tempStatus6 = that.status6 && that.status6.join(',')
          let tempTypesInfo6 = that.typesInfo6 && that.typesInfo6.join(',')
          let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          let option = myChart.getOption()
          let xAxis = option.xAxis
          let name = xAxis[0].data[xIndex]
          let shippingCompanyId1 = temp1[Object.keys(temp1)[xIndex]][0].shippingCompanyId // 物流商ID
          let strrr = [] // 物流商ID
          Object.keys(temp1).forEach((key4, idx) => {
            temp1[key4].forEach((item4, idx1) => {
              if (item4.shortName == name) {
                strrr.push(item4.shippingCompanyId)
              }
            })
          })
          if (that.args6.shippingCompanyId) {
            that.args6_2.shippingCompanyId = that.args6.shippingCompanyId// 物流商ID
          } else {
            that.args6_2.shippingCompanyId = strrr[0] || shippingCompanyId1// 物流商ID
          }
          that.args6_2_title = name// 标题
          that.args6_2.shippingMethodId = that.args6.shippingMethodId// 物流方式id
          that.args6_2.loadTime = that.$moment(that.date6).format('YYYY-MM') // 装车时间 yyyy-mm
          that.args6_2.problemTypesInfo = tempTypesInfo6 // 问题类型细分,多个英文逗号分割
          that.args6_2.processingStatus = tempStatus6 // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
          that.problemStatus6 = true
          that.getProblemStatisticsType()
          console.log('that.args6_2', that.$cloneDeep(that.args6_2))
          // console.log('temp1', that.$cloneDeep(temp1), shippingCompanyId1, '++', Object.keys(temp1), Object.keys(temp1)[xIndex])
          console.log('阴影', xIndex, 'option', option, 'xAxis', xAxis, name, 'strrr', strrr, strrr[0], 'shippingCompanyId1', shippingCompanyId1)
          myChart.clear() // 1、清除画布
          myChart.setOption(option)
        }
      })
    },
    initBar6_2(id, data) { // 横向-柱状图 问题件统计-细分
      console.log('initBar6_2-val', id, data)
      let seriesValue = []
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      console.log(this.$cloneDeep(data.data), 'item--0', typeof data.data)
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let resultarr = []
      if (data) {
        let temp = data.data
        let arr1 = []
        let mmm = []
        if (Object.keys(temp).length == 0) {
          resultarr = []
          arr1 = []
          this.initBar6lent = true
          seriesValue = []
          data.data = {}
          this.initBar6data = null
          this.initBar6shortName = []
        } else {
          seriesValue = []
          this.initBar6lent = false
          if (temp.problemTypesInfo0) {
            mmm = temp.problemTypesInfo0.map(item => item.loadMonth)
          }
          console.log('seriesValue--444', seriesValue, mmm)
          seriesValue = mmm.map((key, index) => {
            return {
              name: key,
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              barMaxWidth: 36, // 柱图宽度
              data: Object.keys(temp).map(key1 => {
                let accc = temp[key1][index].problemTypesInfoCount
                return accc
              })
            }
          })
          this.initBar6data = seriesValue
          Object.keys(temp).forEach(function(key, idx) {
            temp[key].forEach(function(item, idx1) {
              arr1.push(item.problemTypesInfo)
              resultarr = [...new Set(arr1)]
            })
          })
          this.initBar6shortName = resultarr
          console.log('seriesValue--444', seriesValue, resultarr, 'temp', temp)
        }
      } else {
        console.log('seriesValue--else')
      }
      var option = {
        title: {
          top: '0%',
          left: 'center',
          text: data.title,
          textStyle: {
            color: 'red'
          }
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
            endValue: 6
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        legend: {
          top: '4%',
          right: '8%'
        },
        grid: {
          left: '3%',
          right: '6%',
          // bottom: '20%',
          containLabel: true
        },
        xAxis: {
          name: '问题细分',
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
          name: '件数',
          type: 'value'
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
        series: seriesValue
      }
      myChart.setOption(option)
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')
      myChart.getZr().off('click')
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
