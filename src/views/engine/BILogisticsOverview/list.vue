
<style>
td.ivu-table-expanded-cell{
    padding: 2px !important;
}
/*滚动条样式*/
.sonStyle1::-webkit-scrollbar{
    width: 8px;
    /*height: 4px;*/
}
.sonStyle1::-webkit-scrollbar-thumb{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.sonStyle1::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
/* 给里面的body设置高度 */
.sonStyle1 .ivu-table-body{
  max-height: 390px;
  overflow: auto;
}
.sonStyle1 .ivu-table-body::-webkit-scrollbar {
    width: 4px;
    height: 0px;
}
.sonStyle1 .ivu-table-body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.sonStyle1 .ivu-table-body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
.sonStyle1 .ivu-table-row{
    position: relative;
}
.sonStyle1 .fixed_r{
    position: absolute;
    right: 20px;
    top: 50px;
    z-index: 10000;
}
</style>
<template>
  <Card>

    <Row style="margin-bottom: 10px" class="search">
      <Col span="4" class="es-range-warp">
        <DatePicker v-model="date" :options="options2" @on-change="date1Change($event)"  type="daterange" placement="bottom-end" placeholder="请选择时间范围" style="width: 100%"></DatePicker>
      </Col>
      <Col span="3" class="es-range-warp" style="margin-left: 10px;">
        <Select v-model="args2.search.queryType" @on-change="queryTypeChange" placeholder="请选择查询维度">
          <Option value="1">按日期查询</Option>
          <Option value="2">按物流商查询</Option>
          <Option value="3">按平台查询</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left: 10px;">
        <Select v-model="args2.search.shippingCompanyCode" multiple :max-tag-count="1" clearable filterable placeholder="请选择物流商">
            <Option v-for="(value, key) in shippingCompanyOpts" :value="value.substring(value.indexOf('(') + 1,value.indexOf(')'))||''" :key="key">{{key}}-{{value}}</Option>
        </Select>
      </Col>
      <Col span="5" style="margin-left: 10px;">
        <estone-select :multiple="false" :placeholder="'请选择物流方式(单选)'" :filterable="true"
            @change-data="(val)=>{args2.search.shippingMethodCode = val}" :max-tag-count="1"
            @on-change="(val)=>{args2.search.shippingMethodCode = val}" :clearable="true" :val="args2.search.shippingMethodCode"
          :list="shippingmethodss.map((item,idx) => ({val: item.code, label: item.name + '*' +idx}))">
        </estone-select>
      </Col>
      <Col span="2" style="margin-left: 10px;">
        <Select v-model="args2.search.shippingLevel"  clearable filterable placeholder="请选择物流级别(单选)">
          <Option v-for="item in shippingMethodLevelOpts" :value="item.val" :key="item.val">{{ item.label }}
          </Option>
        </Select>
      </Col>
      <Col span="2" style="margin-left: 10px;">
        <Select v-model="args2.search.saleChannel"  clearable filterable placeholder="请选择平台(单选)" >
          <Option v-for="item in saleChannels" :value="item.code||''"
            :key="item.code">{{ item.name }}</Option>
        </Select>
      </Col>
      <Col span="3" style="margin-left: 10px;">
        <!-- <estone-select :multiple="false" :placeholder="'请选择国家(单选)'" :filterable="true"
              @change-data="(val)=>{args2.search.country = val}" :max-tag-count="1"
              @on-change="(val)=>{args2.search.country = val}" :clearable="true" :val="args2.search.country"
            :list="countries.map(item => ({val: item.twowordname, label: item.chinesename1 + '*' +item.id}))">
        </estone-select> -->
      </Col>
    </Row>
    <Row>
      <Col span="20">
        <Button v-if="hasButtonPermission_1('102070803')" type="primary" :loading="exportLoading" class="es-button-right"  @click="batchExport">导出</Button>
      </Col>
      <Col span="4" style="text-align: right">
        <Button v-if="hasButtonPermission_1('102070801')" type="primary"  @click="searchList" style="margin:0 20px">查询</Button>
        <Button v-if="hasButtonPermission_1('102070802')" :loading="loading" @click="resetList">重置</Button>
      </Col>
    </Row>
    <Divider style="margin: 10px 0" ></Divider>
    <!-- <Option value="1">按日期查询</Option>
    <Option value="2">按物流商查询</Option>
    <Option value="3">按平台查询</Option> -->
    <div >
      <Table   border  ref="table" max-height="660" :columns="tableColumns" :data="tableData" :loading="loading"  >
          <pagination slot="footer" v-show="total>0" :total="total" :offset.sync="args2.offset" :limit.sync="args2.limit" :pageSizes="[10, 20, 50, 100, 150]" @pagination="getList"></pagination>
          <template slot-scope="{ row }" slot="prescriptionSlot">
            <div style="position: relative;">
              <ul class="table_ul">
                <li>7天:&nbsp;{{(row.sevenPrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
                <li>20天:&nbsp;{{(row.twentyPrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
              </ul>
              <ul class="table_ul">
                <li style="color: #FF3D00;">10天:&nbsp;{{(row.tenPrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
                <li style="color: #29B6F6;">25天:&nbsp;{{(row.twentyFivePrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
              </ul>
              <ul class="table_ul">
                <li>15天:&nbsp;{{(row.fifteenPrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
                <li>30天:&nbsp;{{(row.thirtyPrescriptionRate || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
              </ul>
              <!-- <ul class="table_ul">
                <li style="color: #EC407A;">15天:&nbsp;{{(row.fifteenPrescription || 0).toFixed(2)}}&nbsp;%&nbsp;</li>
              </ul> -->
            </div>
          </template>
      </Table>
    </div>
    <Spin size="large" class="spin-show" fix v-if="isLoadingChart">
      <Icon type="ios-loading" size='25' class="demo-spin-icon-load"></Icon>
      <div>加载中</div>
    </Spin>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import estoneSelect from '@/views/engine/common/estone-select.vue'
import Pagination from '@/components/pagination'
import * as developeraccountOpt from '@/api/developeraccount.api.js'
import * as reportApi from '@/api/report.api.js'
export default {
  name: 'BI-logisticsOverview',
  components: {
    estoneSelect,
    Pagination
  },
  data() {
    return {
      shippingmethodss2: [],
      // saleChannels: [],
      shippingMethodFilter: false, // 筛选物流方式
      shippingCompanyOpts: {}, // 物流商
      salechannelOpts: {}, // 平台
      date: [], // 时间双向绑定
      loading: false,
      exportLoading: false,
      isLoadingChart: false,
      shippingMethodLevelOpts: [ // 物流级别
        // { label: '全部', val: '' },
        { label: '平邮', val: 'M' },
        { label: '挂号', val: 'R' },
        { label: '快递', val: 'E' }
      ],
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
      selectedRows: [],
      selectedRowsSon: [],
      sonDadArgs: {}, // 自数据
      args2: { // 查询参数
        search: {
          queryType: '1', // 查询类型 1:按日期查询 2:按物流商查询 物流商-物流级别-物流方式-国家明细 3:按平台查询 物流商-物流方式-国家明细
          shippingCompanyCode: [], // 物流公司代码,多个英文逗号分隔
          shippingLevel: '', // 物流级别
          // // shippingMethodCode: ['WS-BRDDU'],
          shippingMethodCode: '', // 物流方式代码,多个英文逗号分隔
          // shippingMethodCodes: [], // 不显示物流方式代码,
          // country: [], // 	目标国家二字码,多个英文逗号分隔
          saleChannel: '', // 平台
          loadDateStart: '2023-07-01', // 发货开始时间
          loadDateEnd: '2023-07-25' // 	发货结束时间
        },
        pageReqired: true,
        limit: 100,
        offset: 0
      },
      total: 0, // 总条数
      tableColumns: [ // 按日期查询
        {
          type: 'index',
          title: '序号',
          width: 50,
          align: 'center'
        }, {
          title: '装车日期1',
          key: 'loadDte',
          align: 'center',
          width: 100
        }, {
          title: '发货数量',
          key: 'deliveryNum',
          align: 'center',
          width: 100
        }, {
          title: '重量(g)',
          align: 'center',
          minWidth: 150,
          render: (h, { row, index, column }) => {
            return h('div',
              {
                style: { 'text-align': 'left', 'padding-left': '4px', 'padding-right': '4px' }
              },
              [
                h('div', `预估重量：${row.estimateWeight || ' '}`),
                h('div', `交运重量: ${row.actualWeight || ' '}`),
                h('div', `平均重量: ${row.averageWeight || ' '}`)
              ]
            )
          }
        }, {
          title: '运费',
          align: 'center',
          width: 150,
          render: (h, { row, index, column }) => {
            return h('div',
              {
                style: { 'text-align': 'left', 'padding-left': '4px', 'padding-right': '4px' }
              },
              [
                h('div', `预估运费：${(row.estimateFee && row.estimateFee.toFixed(2)) || ''}`),
                h('div', `交运运费: ${(row.actualFee && row.actualFee.toFixed(2)) || ''}`),
                h('div', `平均运费: ${(row.actualFee && row.averageFee.toFixed(2)) || ''}`)
              ]
            )
          }
        }, {
          title: '退款信息',
          key: 'refundCount',
          align: 'center',
          width: 120,
          render: (h, { row, index, column }) => {
            return h('div',
              {
                style: { 'text-align': 'left', 'padding-left': '4px', 'padding-right': '4px' }
              },
              [
                h('div', `退款数：${row.refundCount || ' '}`),
                h('div', `退款率: ${(row.refundRate && row.refundRate + '%') || ' '}`)
              ]
            )
          }
        }, {
          title: '签收数/签收率',
          key: 'signCount',
          align: 'center',
          width: 80,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.signCount || ' '}`),
                h('div', `${(row.signRate && row.signRate + '%') || ' '}`)
              ]
            )
          }
        }, {
          title: '未上网/未上网率',
          key: 'noNetCount',
          align: 'center',
          width: 80,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.noNetCount || ' '}`),
                h('div', `${(row.noNetRate && row.noNetRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '上网数/上网率',
          key: 'netCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.netCount || ' '}`),
                h('div', `${(row.netRate && row.netRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '运输数/运输率',
          key: 'shippingCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.shippingCount || ' '}`),
                h('div', `${(row.shippingRate && row.shippingRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '妥投异常/妥投异常率',
          key: 'abnormalCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.abnormalCount || ' '}`),
                h('div', `${(row.abnormalRate && row.abnormalRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '妥投超时数/妥投超时率',
          key: 'timeoutCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.timeoutCount || ' '}`),
                h('div', `${(row.timeoutRate && row.timeoutRate + '%') || ' '}`)
              ])
          }
        }, /* {
          title: '索赔数/索赔率',
          key: 'totalDelivery',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.totalDelivery || ''}`),
                h('div', `${row.weight.toFixed(2) || ''}`)
              ])
          }
        }, */ {
          title: '问题数/问题率',
          key: 'problemCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.problemCount || ' '}`),
                h('div', `${(row.problemRate && row.problemRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '提取数/提取率',
          key: 'crawlingCount',
          align: 'center',
          width: 90,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row, index, column }) => {
            return h('div',
              [
                h('div', { class: { 'split-line': true } }, `${row.crawlingCount || ' '}`),
                h('div', `${(row.crawlingRate && row.crawlingRate + '%') || ' '}`)
              ])
          }
        }, {
          title: '妥投时效(天)',
          key: 'twentyPrescription',
          align: 'center',
          width: 100,
          renderHeader: (h, { index, column }) => h('div', { style: { display: 'inline-block' } }, column.title.split('/').map(t => h('div', { style: { lineHeight: '16px' } }, t))),
          render: (h, { row }) => {
            // return h('div', `${(row.twentyPrescription || '')}`)
            return h('div', {
              style: { 'text-align': 'left' }
            },
            [
              h('div', { class: { 'split-line': true } }, `平均妥投:${row.averageSignDays || ''}`),
              h('div', { class: { 'split-line': true } }, `90分位:${row.percentileAging || ''}`)
            ])
          }
        },
        {
          title: '周期妥投率',
          key: 'fifteenPrescription',
          align: 'center',
          slot: 'prescriptionSlot',
          width: 210
        }, {
          title: '发货渠道数',
          key: 'methodNum',
          align: 'center',
          width: 90
        }
      ],
      tableData: []
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'shippingmethodss', // 物流方式
      'saleChannels'/* , // 销售渠道
      'countries' // 国家 */
    ]),
    onShippingmethodObjs() { // 已启用物流方式
      return this.$store.state.onShippingmethodObjs
    }
  },
  created() {
    this.date = [this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(0, 'days').format('YYYY-MM-DD')]
    // this.getCompanyList1()
    // this.resetList()
  },
  methods: {
    shippingMethodFilterChange(val) { // 是否筛选物流方式
      this.shippingMethodFilter = val
      if (val === false) return
      if (this.shippingMethodFilter) {
        this.args2.search.shippingMethodCode = []
      }
      this.shippingmethodss2 = this.onShippingmethodObjs
    },
    init() {

    },
    getCompanyList1() {
      developeraccountOpt.getCompanyList().then(res => { // 物流商
        this.shippingCompanyOpts = res.data.result || {}
      }).catch(function(err) {
        console.log(err)
      })
    },
    setTime() { // 装车时间默认- 当前时间-60天  至  当前时间-30天
      const start = this.$moment().subtract(7, 'days').format('YYYY-MM-DD')
      const end = this.$moment().subtract(0, 'days').format('YYYY-MM-DD')
      this.date = [start, end]
      this.args2.search.loadDateStart = start
      this.args2.search.loadDateEnd = end
    },
    date1Change(date) { // 选择时间查询
      if (date[0] !== '') {
        this.args2.search.loadDateStart = date[0]
        this.args2.search.loadDateEnd = date[1]
      } else {
        this.args2.search.loadDateStart = ''
        this.args2.search.loadDateEnd = ''
      }
    },
    expandSelectedRows(data) { // 子数据
      this.selectedRowsSon = data
    },
    queryTypeChange(data) { // 查询维度
      console.log('查询维度', data)
      this.tableData = []
      this.total = 0
    },
    // 重置查询
    resetList() {
      this.args2 = this.$cloneDeep(this.$options.data().args2) // 初始化
      this.abc = this.$cloneDeep(this.$options.data().abc) // 初始化
      this.isCollect = ''
      this.tempSearch = this.$cloneDeep(this.$options.data().tempSearch) // 初始化
      this.isOpenType = false
      this.setTime()
      this.getList()
    },
    // 查询按钮
    searchList() {
      // 初始化分页
      this.args2.offset = 0
      // this.args2.limit = 10
      this.getList()
    },
    // 获取列表
    getList() {
      this.exportLoading = true
      this.loading = true// 数据处理
      const temp = this.$cloneDeep(this.args2.search)
      // if (this.args2.search.shippingCompanyCode && this.args2.search.shippingCompanyCode.length >= 1) {
      //   temp.shippingCompanyCode = this.args2.search.shippingCompanyCode.join(',')
      // } else {
      //   temp.shippingCompanyCode = ''
      // }
      temp.shippingCompanyCode = (temp.shippingCompanyCode || []).join(',')
      // temp.search.shippingMethodCode = (temp.search.shippingMethodCode || []).join(',')
      console.log('search', temp)
      this.sonDadArgs = this.args2.search
      reportApi.getBiLogisticsInfoBase(temp).then(res => {
        if (res.data.success) {
          this.tableData = (res.data && res.data.result) || []
          this.total = (res.data && res.data.result.length) || 0
        } else {
          this.$Message.error(res.data.errorMsg || '获取数据失败')
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error(err || err.data.errorMsg || '获取数据异常')
      }).finally(() => {
        this.exportLoading = false
        this.loading = false
      })
    },
    pageChange(page) {
      this.args2.offset = (page - 1) * this.args2.limit
      this.getList()
    },
    // 切换每页展示的条数
    pageSizeChange(pageSize) {
      this.args2.limit = pageSize
      this.getList()
    },
    selectionChange(selection) {
      this.selectedRows = selection
    },
    batchExport() { // 导出
      const _this = this
      // _this.tableLoading = true
      _this.exportLoading = true
      const temp = this.$cloneDeep(this.args2)
      // temp.shippingCompanyCode = (temp.shippingCompanyCode || []).join(',')
      temp.search.shippingCompanyCode = (temp.search.shippingCompanyCode || []).join(',')

      // console.log({ ..._this.args2.search }, '导出args')

      if (_this.selectedRows.length) {
        _this.args2.search.ids = _this.selectedRows.map(item => item.id)
        reportApi.exportBiLogisticsInfoBase(temp.search).then(function(res) { // 导出流
          _this.exportBoble(res, 'BI总览报表1')
        }).catch(function(err) {
          console.log(err)
        }).finally(function() {
          _this.args2.search.ids = []
          _this.tableLoading = false
          _this.loading = false
        })
      } else {
        /* if (!temp.search.shippingCompanyCode && !temp.search.shippingMethodCode &&
        !temp.search.shippingLevel && !temp.search.saleChannel) {
          this.$Message.success({ content: '亲亲，全部导出有些慢，请耐心等待！', duration: 5, closable: true })
        }
        this.$Modal.confirm({
          title: '导出确认',
          content: `<div>
              <p>亲亲，全部导出有些慢，建议选择条件导出，那样会更快哦！</p>
              <p>如需继续导出，请点击确定按钮</p>
            </div>`,
          onOk: () => {
            _this.exportBiInfoBase(temp)
          },
          onCancel: () => {
            this.$Message.info('取消')
          }
        }) */
        this.$Message.success({ content: '后台正在导出数据，请勿重复操作，等待系统返回下载结果！', duration: 5, closable: true })
        reportApi.exportBiLogisticsInfoBase(temp.search).then(res => { // 导出流
          this.exportBoble(res, 'BI总览报表')
        }).catch(function(err) {
          console.log(err)
        }).finally(() => {
          this.exportLoading = false
        })
      }
    },
    exportBiInfoBase(temp) { // 物流时效报表 与 物流跟踪报表导出 公用方法
      reportApi.exportBiLogisticsInfoBase(temp.search).then(res => { // 导出流
        this.exportBoble(res, 'BI总览报表')
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.exportLoading = false
      })
    },
    exportBoble(res, val = '') { // 物流时效报表 与 物流跟踪报表导出 公用方法
      const _this = this
      const blob = new Blob([res.data])// response.data为后端传的流文件
      const downloadFilename = val + _this.$initTime(new Date()) + '.xlsx'// 设置导出的文件名
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // 兼容ie浏览器
        window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
      } else {
        // 谷歌,火狐等浏览器
        const url = window.URL.createObjectURL(blob)
        const downloadElement = document.createElement('a')
        downloadElement.style.display = 'none'
        downloadElement.href = url
        downloadElement.download = downloadFilename
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(url)
      }
      _this.$Message.success('导出成功！')
    }
  }
}
</script>
<style lang="less" scoped>
.search .label {
  line-height: 32px;
  float: right;
}
.table_ul{
  display: flex;justify-content: left;
  align-items: flex-end;
  height: 20px;
  line-height: 20px;
}
.table_ul li{
  list-style: none;
  width: 46%;
  text-align: left;
  padding-left: 4px;
}
</style>
