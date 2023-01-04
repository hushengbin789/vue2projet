<template>
  <div>
    <Row>
      <Col span="24" >
        <!-- <CheckboxGroup v-model="initBar8dataGroup" @on-change="changeCountry8">
          <Checkbox v-for="(item,idx) in initBar8data"  :key="idx" :label="item.twowordname" >
            <div :style="{color:initBar8dataGroup.some(item1 => item1 === item.twowordname) ? 'red':'#515a6e'}" style="display: inline-block;">
              <span>{{ item.twowordname }}</span>-<span>{{ item.chinesename }}</span>
            </div>
          </Checkbox>
        </CheckboxGroup> -->
        <RadioGroup v-model="initBar8dataGroup" @on-change="changeCountry8" type="button">
          <Radio v-for="(item,idx) in initBar8data" :key="idx" :label="item.twowordname">
            <span>{{ item.twowordname }}</span>-<span>{{ item.chinesename }}</span>
          </Radio>
        </RadioGroup>
      </Col>
      <!-- <Col span="4">
        <Button type="primary" @click="getYesterTrajectory" :loading="tableLoading" >查询111</Button>
      </Col> -->
    </Row>
    <div  id="dom8"  v-if="!initBar8lent" class="qqqq chart-box" style="height: 540px;margin-top: 10px;"></div>
    <div  v-if="initBar8lent"  class="wwww" style="height: 540px;margin-top: 10px;background-color: #fff;text-align: center;line-height: 540px;">
      暂无数据
    </div>
    <div v-if="false">
      <Button :icon="showSearch ? 'ios-arrow-up' : 'ios-arrow-down'" style="margin: 10px 0 10px 0" @click="showSearchArea">
        {{ showSearch ? '隐藏更多' : '展开更多' }}
      </Button>
    </div>
    <div v-if="false">
      <Table border  stripe highlight-row :loading="tableLoading" :columns="tableColumns8" :data="tableData8"
        ref="table" >
      </Table>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import * as home from '@/api/home.api.js'
import { addRandomColor, randomColor2 } from '@/libs/util.js'
export default {
  props: {
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
      initBar8lent: true,
      colorList6: [], // 随机颜色
      colorList8: [ // 42组颜色，当超过42国家数据时这里要多新增几个颜色哦，抄边界了
        '#5b9bd5', '#F0805A', '#9BCA63', '#a5a5a5', '#67e0e3',
        '#BCAAA4', '#FFF59D', '#80CBC4', '#9FA8DA', '#EF9A9A',
        '#E0E0E0', '#FFE082', '#A5D6A7', '#90CAF9', '#F48FB1',
        '#B0BEC5', '#FFCC80', '#C5E1A5', '#81D4FA', '#CE93D8',
        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
        '#5b9bd5', '#19be6b', '#ed7d31', '#a5a5a5', '#67e0e3'
      ],
      initBarCountry8: '', // 国家
      initBar8data: [], // 去重的国家
      initData8: [], // 原数据
      initBar8dataGroup: '', // 默认显示的国家数量
      tableData8: [],
      showSearch: false,
      tableColumns8: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        }, {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        }, {
          title: '国家',
          width: 80,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', row.country)
          }
        }, {
          title: '物流商',
          key: 'shippingCompanyCode',
          minWidth: 150,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', this.pullLogisticsProvider[row.shippingCompanyId])
          }
        }, {
          title: '物流方式code',
          width: 150,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', row.shippingMethodCode)
          }
        }, {
          title: '物流方式名称',
          minWidth: 180,
          align: 'center',
          render: (h, { row, index, column }) => {
            // 通过 vuex 转换 shippingMethodCode 为 中文名
            let text = this.$store.state.shippingmethodss[row.shippingMethodCode] || row.shippingMethodCode
            return h('span', [text])
          }
        }, {
          title: '发货时间',
          key: 'loadTime',
          width: 140,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', this.$initTime(row.loadTime))
          }
        }, {
          title: '发货数量',
          key: 'totalCount',
          width: 100,
          align: 'center'
        }, {
          title: '查询时间',
          key: 'queryTime',
          width: 140,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', this.$initTime(row.queryTime))
          }
        }, {
          title: '妥投率',
          key: 'prescRate',
          width: 110,
          align: 'center',
          render: (h, { row, index, column }) => {
            return h('div', row.prescRate + '%')
          }
        }, {
          title: '轨迹妥投',
          key: 'updateTime',
          width: 160,
          align: 'left',
          render: (h, { row, index, column }) => {
            return h('div', `${row.limitationEstimate}天/${row.limitationEstimateRate}%`)
          }
        }
      ],
      data: {
        data8: []
      }
    }
  },
  created() {
    this.getFindSelectValues()
  },
  methods: {
    initAll8() { // 轨迹预警
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data8).length == 0) {
          this.initBar8lent = true
        } else {
          this.initBar8lent = false
          setTimeout(() => {
            this.initBar8('dom8', { title: '轨迹预警报表', data: datas.data8 || {} })
          }, 300)
        }
      })
    },
    initBar8(id, data) { // 横向-柱状图 轨迹预警
      // console.log('initBar8-val', id, this.$cloneDeep(data))
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      const _this = this
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let option = {
        title: {
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            // let Params = params[0]
            let data1 = data.data[params[0].dataIndex]
            let temp1 = `时效预警标准：${data1.limitationEstimate}天/${data1.limitationEstimateRate}%`
            // console.log('formatter', params, data1) // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            let str = data1.shippingName + '<br>' + `实际妥投率：${data1.prescRate}%` + '<br>' + `发货数量：${data1.totalCount}` + '<br>' + `装车时间：${data1.loadTime}` + '<br>' + temp1
            return str
          }
        },
        legend: {
          show: false
        },
        dataZoom: data.data && data.data.length >= 36 ? [
          {
            show: true, // 不显示下面的滑块
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 35
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ] : [
          {
            show: false, // 不显示下面的滑块
            type: 'slider'
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '物流方式',
          type: 'category',
          axisLabel: {
            show: true,
            interval: 2,
            lineHeight: 18,
            formatter: function(params) {
              // console.log('formatter', params, params.length)
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 6// 每行能显示的字的个数
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              if (paramsNameNumber > provideNumber) {
                newParamsName = params.substring(0, 10) + '..'// 最终拼成的字符串
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: data.data.map(item => item.shippingMethodCode)
        },
        yAxis: {
          name: '实际妥投率%',
          type: 'value',
          min: 0,
          max: 100,
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: '美国',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => item.prescRate),
            itemStyle: {
              normal: {
                // 好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                color: function(params) {
                  let arr = data.data // 原数据 data.data
                  /* let colorList = [ // 42组颜色，当超过42国家数据时这里要多新增几个颜色哦，抄边界了
                    '#5b9bd5', '#F0805A', '#9BCA63', '#a5a5a5', '#67e0e3',
                    '#BCAAA4', '#FFF59D', '#80CBC4', '#9FA8DA', '#EF9A9A',
                    '#E0E0E0', '#FFE082', '#A5D6A7', '#90CAF9', '#F48FB1',
                    '#B0BEC5', '#FFCC80', '#C5E1A5', '#81D4FA', '#CE93D8',
                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
                    '#5b9bd5', '#19be6b', '#ed7d31', '#a5a5a5', '#67e0e3'
                  ]

                  //  * 1.循环原数据
                  //  * 2.相同的国家颜色使用一样的
                  //  * 3.先组装数据，然后在拆分数据

                  let arrCountry = [] // 去重的国家
                  let arrShippingMethodCode = [] // 去重的物流方式
                  let arr = data.data // 原数据 data.data
                  arr.forEach((item, idx) => {
                    arrCountry.push(item.country)
                    arrCountry = Array.from(new Set(arrCountry))
                    arrShippingMethodCode.push(item.shippingMethodCode)
                    arrShippingMethodCode = Array.from(new Set(arrShippingMethodCode))
                  })
                  let newArr = []// 重组数据
                  arrShippingMethodCode.forEach((item2, idx) => { // 把相同国家的数据放一起了，方便后面再次循环
                    let obj = {
                      shippingMethodCode: item2,
                      num1: [],
                      list: []
                    }
                    arr.forEach((i, ind) => {
                      if (item2 === i.shippingMethodCode) {
                        obj.list.push(i)
                        obj.num1.push(i.totalCount)
                      }
                    })
                    newArr.push(obj)
                  })
                  // 给每个数据中添加color色值，但是得保证色值的数量大于国家的数据
                  // index 是颜色的下标，如果一旦 国家的数量大于 颜色值的话，就凉凉了
                  let viewArr = [] // 包含color的新数据
                  newArr.forEach((item, index) => {
                    item.list.forEach((i, ind) => {
                      i.color = colorList[index]
                      viewArr.push(i)
                    })
                    item.num2 = item.num1.reduce(function(total, value) {
                      return total + value
                    }, 0)
                  }) */
                  // console.log('newArr', _this.$cloneDeep(newArr))
                  // return viewArr[params.dataIndex].color
                  return arr[params.dataIndex].colors1
                }
              }
            },
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '妥投率',
            type: 'line',
            data: data.data.map(item => item.limitationEstimateRate),
            itemStyle: {
              color: '#19be6b'
            },
            label: {
              show: true,
              position: 'bottom',
              normal: {
                show: true,
                position: 'bottom',
                formatter: function(v) {
                  let val = v.data
                  return val + '%'
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
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
          // console.log('xIndex', xIndex, JSON.parse(JSON.stringify(temp1[xIndex])), 'temp1', temp1)
          _this.$router.push({
            name: 'time-liness',
            params: {
              country: temp2.country || '',
              loadTime: temp2.loadTime || '',
              shippingMethodCode: temp2.shippingMethodCode || ''
            }
          })
        }
      })
    },
    childMethod() {
      this.$emit('fatherMethod')
    },

    randomColorList(num = 42) { // rgba 可调控透明度
      let temp = []
      for (var i = 0; i < num; i++) {
        temp.push(addRandomColor())
      }
      this.colorList6 = temp
    },
    randomColorList2(num = 42) { // 16进制 深浅颜色系列 默认深色系列
      let temp = []
      for (var i = 0; i < num; i++) {
        temp.push(randomColor2())
      }
      this.colorList6 = temp
    },
    changeCountry8(val) { // 改变国家
      // 注  如果有更好的方法可以重构一下这里，现for循环太多了，如果数据量很多会造成卡顿问题，目前不会有问题的
      const _this = this
      let temp = _this.initData8 // 原数据
      let initBar8dataGroup = _this.initBar8dataGroup // 所选择的国家
      let arrSet = [] // 过滤完之后的数据
      let shippingMethodSet = [] // 去重之后的物流方式
      temp.sort(this.compare('totalCount', false))
      temp.forEach(item1 => {
        if (initBar8dataGroup == item1.country) {
          arrSet.push(item1)
          shippingMethodSet.push(item1.shippingMethodCode)
        }
      })
      shippingMethodSet = Array.from(new Set(shippingMethodSet)) // 当前选中的国家去重之后的物流方式

      arrSet.forEach(item => { // 给相同的物流方式添加颜色区分 colors1
        shippingMethodSet.forEach((item1, idx1) => {
          if (item.shippingMethodCode == item1) {
            Object.assign(item, { colors1: `${this.colorList8[idx1]}` })
          }
        })
      })
      // console.log('arrSet-8', this.$cloneDeep(arrSet))
      let newArr = []// 重组数据
      shippingMethodSet.forEach((item2, idx) => { // 把相同物流方式Code的数据放一起了，方便后面再次循环
        let obj = { // 拿到对应的code 和 总数 totalCount
          shippingMethodCode: item2,
          totalCountList: [],
          list: []
        }
        arrSet.forEach((i, ind) => {
          if (item2 === i.shippingMethodCode) {
            obj.list.push(i)
            obj.totalCountList.push(i.totalCount)
          }
        })
        newArr.push(obj)
      })
      // console.log('newArr2', this.$cloneDeep(newArr))
      newArr.forEach(item => { // 这里是算出每一个物流方式对应的发货数量总数
        item.totalCount1 = item.totalCountList.reduce(function(total, value) {
          return total + value
        }, 0)
      })
      // 根据对应物流方式排序 true为正序 false为倒序  下面两种都可以排序
      let sortTotalCountArr = (newArr || []).sort(function(a, b) { return b.totalCount1 - a.totalCount1 })
      // let sortTotalCountArr = (newArr || []).sort(this.compare('totalCount1', false))
      // console.log('sortTotalCountArr', this.$cloneDeep(sortTotalCountArr))
      let newArrSet = []
      // 根据物流方式排序完之后跟原数据比较一下Code是否相同，相同直接push进去，可以保证图表数据是根据物流方式来的
      sortTotalCountArr.forEach(item => {
        arrSet.forEach(item1 => {
          if (item.shippingMethodCode === item1.shippingMethodCode) {
            newArrSet.push(item1)
          }
        })
      })
      _this.tableData8 = newArrSet.slice(0, 10)
      _this.data.data8 = newArrSet
      _this.showSearch = false
      _this.initAll8()
    },
    showSearchArea() { // 轨迹预警展开收起
      // 1.拿渲染数据，而不是原数据
      this.showSearch = !this.showSearch
      if (!this.showSearch) {
        this.tableData8 = this.tableData8.slice(0, 10)
      } else {
        this.tableData8 = this.data.data8
      }
    },
    /** 两个参数： 参数1 是排序用的字段， 参数2 是：是否升序排序 true 为升序，false为降序 */
    compare(attr, rev) {
      if (rev == undefined) {
        rev = 1
      } else {
        rev = (rev) ? 1 : -1
      }
      return (a, b) => {
        a = a[attr]
        b = b[attr]
        if (a < b) {
          return rev * -1
        }
        if (a > b) {
          return rev * 1
        }
        return 0
      }
    },
    getYesterTrajectory() { // 首页昨日标准追踪数据查询
      const _this = this
      this.randomColorList() // 查询调用颜色值
      home.searchYesterTrajectory().then(res => {
        if (res.data.success) {
          // let temp = res.data.result ? Object.freeze(res.data.result) : []
          let arr = []
          let temp2 = this.$store.state.shippingmethodss // 物流方式中英文名

          let temp = (res.data.result || [])
          temp.forEach(item => {
            this.countries.forEach(item1 => {
              if (item.country == item1.twowordname) {
                arr.push({
                  twowordname: `${item1.twowordname}`,
                  chinesename: `${item1.chinesename}`
                })
              }
            })
            Object.assign(item, { shippingName: `${temp2[item.shippingMethodCode]}` })
          })
          let map = new Map()
          for (let item of arr) {
            map.set(item.chinesename, item)
          }
          arr = [...map.values()]
          _this.initBar8data = arr
          _this.initBar8dataGroup = arr.map(item => item.twowordname).slice(0, 1).toString()
          _this.initData8 = temp // 原数据
          _this.tableData8 = temp.slice(0, 10)
          _this.data.data8 = temp
          _this.changeCountry8(_this.initBar8dataGroup) // 默认前两个国家数据
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取轨迹预警数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
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
