<template>
  <Card>
    <!-- 搜索栏 -->
    <Row class="search" style="margin-bottom: 10px">
      <i-col span="2">
        <span class="label">物流商：</span>
      </i-col>
      <i-col span="4">
        <Select v-model="args.search.shippingCompanyCode" @on-change="changeShippingCompanyCode('search', $event)" clearable filterable placeholder="请选择物流商">
          <Option v-for="(value, key) in shippingCompanyOpts" :value="value.substring(value.indexOf('(') + 1,value.indexOf(')'))||''" :key="key">{{key}}-{{value}}</Option>
        </Select>
      </i-col>
      <i-col span="2">
        <span class="label">物流方式：</span>
      </i-col>
      <i-col span="5">
        <Select v-if="args.search.shippingCompanyCode&&!shippingMethodFilter" v-model="args.search.shippingMethodCode"  clearable filterable placeholder="请选择物流方式" style="width: 100%;">
          <Option v-for="(value, key) in shippingmethodOpts" :value="key" :key="key">{{ value }}</Option>
        </Select>
        <Select v-else-if="!args.search.shippingCompanyCode&&!shippingMethodFilter" v-model="args.search.shippingMethodCode" clearable filterable placeholder="请选择物流方式">
          <Option v-for="(value, key) in shippingmethodss" :value="value.code || ''" :key="key">{{value.name}}</Option>
        </Select>
        <Select v-if="shippingMethodFilter" v-model="args.search.shippingMethodCode" clearable filterable   placeholder="请选择物流方式" >
          <Option v-for="(item) in shippingmethodss2" :value="item.code || ''" :key="item.id" >{{ item.code }}-{{ item.name }}</Option>
        </Select>
      </i-col>
      <i-col span="1">
        <div style="display: flex;justify-content: center;height: 30px;align-items: center;">
          <Checkbox v-model="shippingMethodFilter" style="font-size: 14px;" @on-change="shippingMethodFilterChange">筛选</Checkbox>
        </div>
      </i-col>
      <i-col span="1">
        <span class="label">国家：</span>
      </i-col>
      <i-col span="3">
        <Select v-model="args.search.dstCountry"  clearable filterable placeholder="请选择国家">
          <Option v-for="(item, key) in countries" :value="item.twowordname || ''" :key="item.twowordname + `_${key}`">{{item.chinesename1}}</Option>
        </Select>
      </i-col>
      <Col span="2"><span class="label">平台：</span></Col>
      <Col span="4">
          <Select v-model="args.search.salechannel"  clearable filterable placeholder="请选择平台">
              <Option v-for="(value, key) in salechannelOpts" :value="value.code" :key="key">{{key}}-{{value.name}}</Option>
          </Select>
      </Col>
    </Row>
    <Row  class="search" style="margin-bottom: 10px">
      <i-col span="2">
        <span class="label">操作时间：</span>
      </i-col>
      <i-col span="4" class="es-range-warp timeStyle_1">
        <DatePicker v-model="date" :options="options2" @on-change="date1Change($event)" @on-open-change="date2Change" type="datetimerange" placement="bottom-start" placeholder="请选择操作时间" style="width: 100%"></DatePicker>
      </i-col>
      <i-col span="2">
        <span class="label">装车时间：</span>
      </i-col>
      <i-col span="5" class="es-range-warp">
          <date-picker type="datetime" :options="begintime" :value="tempSearch.startTime" @on-change="setSearch($event, 'startTime')" placement="bottom-start" placeholder="起始时间" style="width: 50%" transfer class="item"></date-picker>
              <span class="hyphen">-</span>
          <date-picker type="datetime" :options="endtime" :value="tempSearch.endTime" @on-change="setSearch($event, 'endTime')" placement="bottom-start" placeholder="结束时间" style="width: 50%" transfer class="item"></date-picker>
      </i-col>
    </Row>
    <!-- 按钮区 -->
    <Row>
      <i-col span="20"  style="text-align: left">
        <Button :loading="tableLoading" type="primary" style="margin-right: 4px" @click="batchExport">导出</Button>
      </i-col>
      <i-col span="4" style="text-align: right">
        <Button  :loading="tableLoading" type="primary" @click="searchList" class="es-button-right">查询</Button>
        <Button  :loading="tableLoading" @click="resetList">重置</Button>
      </i-col>
    </Row>
    <!-- 分割线 -->
    <Divider style="margin: 10px 0" ></Divider>
    <!-- 表格区 -->
    <Table border stripe highlight-row ref="table" height="710" :loading="tableLoading" :columns="tableColumns" :data="tableData" @on-selection-change="selectionChange">
      <!-- 分页组件区 -->
      <Pagination slot="footer" v-show="total > 0" :total="total" :offset.sync="args.offset" :limit.sync="args.limit" :pageSizes="[10, 20, 50, 100, 200, 500]" @pagination="getList"></Pagination>
    </Table>
  </Card>
</template>
<script>
import Pagination from '@/components/pagination'
import * as prescTimeApi from '@/api/prescTime.api.js'
import { mapGetters } from 'vuex'
import * as commonOpr from '@/api/common.api'
export default {
  name: 'presc-time',
  components: { Pagination },
  data() {
    return {
      shippingmethodss2: [],
      shippingMethodFilter: false, // 筛选物流方式
      shippingmethodOpts: null, // 查询的物流产品下拉
      tempSearch: {
        tempsTypeVal: 'loadDate', // 时间类型
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      date: [], // 时间双向绑定 - 操作时间
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
            text: '近一个月',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
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
          },
          {
            text: '近六个月',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              return [start, end]
            }
          }
        ]
      },
      // 搜索栏禁用开始时间
      begintime: {
        disabledDate: data => {
          const end = new Date(this.tempSearch.endTime).valueOf()
          return data && this.tempSearch.endTime && data.valueOf() > end
        }
      },
      // 搜索栏禁用结束时间
      endtime: {
        disabledDate: data => {
          const begin = new Date(this.tempSearch.startTime).valueOf()
          return data && this.tempSearch.startTime && data.valueOf() < begin
        }
      },
      shippingCompanyOpts: {}, // 物流商下拉
      salechannelOpts: {}, // 平台
      selectedRows: [],
      args: {
        search: {
          shippingCompanyCode: '', //	否	string	物流公司代码
          shippingMethodCode: '', //	否	string	物流方式代码
          dstCountry: '', // 否	目标国家二字码
          salechannel: '', // 否	平台
          loadStartTime: '', // 否	发货开始时间
          loadEndTime: '', // 否	发货结束时间
          operatorStartTime: '', // 否	操作开始时间
          operatorEndTime: '', // 否	操作开始时间
          ids: [] //	否	list	物流产品
        },
        pageReqired: true,
        limit: 20,
        offset: 0
      }, // 查询参数
      total: 0, // 总条数
      tableLoading: false, // 表格加载
      tableData: [], // 表格数据
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '订单号',
          key: 'orderNo',
          align: 'center',
          width: 160
        },
        {
          title: '发货单号',
          key: 'apvNo',
          align: 'center',
          width: 160
        },
        {
          title: '跟踪单号',
          key: 'trackingNumber',
          align: 'center',
          width: 160
        },
        {
          title: '平台',
          key: 'salechannel',
          align: 'center',
          width: 120
        },
        {
          title: '物流商',
          key: 'shippingCompanyName',
          align: 'center',
          width: 250
        },
        {
          title: '物流方式',
          key: 'shippingMethodCode',
          align: 'center',
          minWidth: 140,
          render: (h, { row }) => {
            const text = this.$store.state.shippingmethodss[row.shippingMethodCode] || row.shippingMethodCode
            return h('span', [text])
          }
        },
        {
          title: '国家',
          key: 'buyerCountryChineseName',
          align: 'center',
          width: 120
        },
        {
          title: '装车时间',
          key: 'loadTime',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('div', this.$initTime(row.loadTime))
          }
        },
        {
          title: '操作时间',
          key: 'operatorTime',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('div', this.$initTime(row.operatorTime))
          }
        }
      ] // 列render
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'shippingmethodss', // 物流方式id
      'countries' // 国家
    ]),
    onShippingmethodObjs() { // 已启用物流方式
      return this.$store.state.onShippingmethodObjs
    }
  },
  async created() {
    this.shippingMethodFilterChange(true)
    this.searchList()
    this.getallSalechannels()
  },
  methods: {
    shippingMethodFilterChange(val) { // 是否筛选物流方式
      this.shippingMethodFilter = val
      if (val === false) return
      if (this.shippingMethodFilter) {
        this.args.search.shippingMethodCode = ''
      }
      this.shippingmethodss2 = this.onShippingmethodObjs
    },
    // 物流商code联动物流方式code
    changeShippingCompanyCode(type, code) {
      if (!code) {
        if (type === 'search') { // 查询
          this.shippingmethodOpts = null
          return
        }
      }
      this.args.search.shippingMethodCode = ''
      commonOpr.findSelectByCompanyCode({ shippingCompanyCode: code }).then(res => {
        const { result } = res.data
        if (type === 'search') {
          this.shippingmethodOpts = result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    date1Change(date) { // 选择时间查询
      this.args.search.operatorStartTime = date[0] // 操作时间-开始日期
      this.args.search.operatorEndTime = date[1]
    },
    date2Change(val) { // 关闭是触发查询
      if (val == false) {
        this.getList()
      }
    },
    selectionChange(selection) {
      const _this = this
      _this.selectedRows = selection
    },
    // 搜索时间处理防抖
    setSearch(value, key) {
      this.tempSearch[key] = value
      this.$emit('setSearch', key, value)
    },
    hasButtonPermission(permission) {
      return this.$store.getters.hasButtonPermission(permission)
    },
    // 获取列表
    getList() {
      this.args.search.loadStartTime = this.tempSearch.startTime // 发货开始时间
      this.args.search.loadEndTime = this.tempSearch.endTime //	发货结束时间
      this.tableLoading = true
      prescTimeApi.searchLogisticsPrescTime(this.args).then(res => {
        console.log(res, '获取列表')
        if (res.data.success) {
          this.tableData = (res.data && res.data.rows) || []
          this.total = (res.data && res.data.total) || 0
        } else {
          this.$Message.error(res.data.errorMsg || '获取数据失败')
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error(err.data.errorMsg || '获取数据异常')
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 重置查询
    resetList() {
      this.args = this.$cloneDeep(this.$options.data().args) // 初始化
      this.tempSearch = this.$cloneDeep(this.$options.data().tempSearch) // 初始化
      this.date = []
      this.getList()
    },
    // 查询按钮
    searchList() {
      // 初始化分页
      this.args.offset = 0
      this.args.limit = 20
      this.getList()
    },
    getallSalechannels() { // 获取平台
      const datas = { // 查询参数
        search: {
          salechannel: '' // 平台
        },
        pageReqired: true,
        limit: 20,
        offset: 0
      }
      const _this = this
      commonOpr.getAllSalechannels(datas).then(function(res) {
        _this.salechannelOpts = res.data.result || {}
      }).catch(function(err) {
        console.log(err)
      })
    },
    batchExport() { //   导出接口
      this.tableLoading = true
      const temp = this.$cloneDeep(this.args)
      if (this.selectedRows.length) {
        temp.search.ids = this.selectedRows.map(item => item.id)
      }
      prescTimeApi.ExportData(temp.search).then(res => {
        exportOfBlob(res, '异常时效', this)
      }).catch(async err => {
        console.log(err)
        this.$Message.error({ content: err, duration: 5 })
      }).finally(() => {
        temp.search.ids = []
        this.selectedRows = []
        this.tableLoading = false
      })
    }
  }
}
</script>
<style >
.timeStyle_1 .ivu-input-suffix{
  width: 28px !important;
  padding-right: 28px !important;
}
.timeStyle_1 .ivu-input-with-suffix{
  padding-right: 28px !important;
}
</style>
<style lang="less" scoped>
.search .label {
  line-height: 32px;
  float: right;
}
</style>
