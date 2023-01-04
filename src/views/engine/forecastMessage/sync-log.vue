<template>
  <div class="login">
    <h1>This is an sync-log page</h1>
    <Button type="info" @click="()=>{this.$router.go(-1)}">主页</Button>
    <Button type="info" @click="getCompanyList()">查询</Button>
    <Button type="info" @click="exportResult()">导出</Button>
    <div>
      <vxe-table
          border
          show-overflow
          highlight-hover-row
          height="610px"
          :sort-config="{trigger: 'cell'}"
          :data="tableData">
          <vxe-table-column type="seq" title="序号" width="100"></vxe-table-column>
          <vxe-table-column field="coNo" title="订单号" sortable></vxe-table-column>
          <vxe-table-column field="apvNo" title="发货单号"></vxe-table-column>
          <vxe-table-column field="shippingOrderNo" title="物流单号"></vxe-table-column>
          <vxe-table-column field="shippingMethodCode" title="物流方式代码" show-overflow></vxe-table-column>
          <vxe-table-column field="syncTime" title="同步时间">
            <template v-slot="{ row }">
              <div>{{ $initTime(row.syncTime) }}</div>
            </template>
          </vxe-table-column>
          <vxe-table-column field="isSyncSuccess" title="同步成功">
            <template v-slot="{ row }">
              <div>{{ (row.isSyncSuccess&&'是')||'否' }}</div>
            </template>
          </vxe-table-column>
          <vxe-table-column field="isDownloadPdf" title="已下载面单">
            <template v-slot="{ row }">
              <div>{{ row.isDownloadPdf?'是':'否' }}</div>
            </template>
          </vxe-table-column>
      </vxe-table>
    </div>
    <Page :total="total" size="small" show-total show-elevator show-sizer :page-size-opts="[10,  50, 200, 500, 1000]"
      @on-change="fn1" @on-page-size-change="fn2"
    ></Page>
  </div>
</template>

<script>
import '@/libs/table.js'
import * as timelinessApi from '@/api/timeliness.api.js'
import * as syncLogApi from '@/api/syncLog.api'
import ExportJsonExcel from 'js-export-excel'
export default {
  name: 'loginV',
  data() {
    return {
      args: { // 查询参数
        search: {
          ids: [],
          shippingCompanyCode: '', // 物流公司代码,多个英文逗号分隔
          // shippingMethodCode: ['ODN-USKX', 'CKY-USKXD', 'SpeedPAK-ES', 'SpeedPAK-ESD'],
          dstCountry: '', // 	目标国家二字码,多个英文逗号分隔
          startLoadTime: '2022-09-01', // 发货开始时间
          endLoadTime: '' // 	发货结束时间
        },
        pageReqired: true,
        limit: 10,
        offset: 0
      },
      total: 0, // 总条数
      tableData: [],
      selectedRows: [], // 选中的行
      loading: false,
      tableLoading: false,
      header: [
        { key: 'shippingCompanyCode', title: '物流商' },
        { key: 'shippingMethodCode', title: '物流方式' },
        { key: 'buyerCountryChineseName', title: '国家' }
      ],
      num1: this.$store.state.num
    }
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    // 表格选中项
    selectTable(val) {
      this.selectedRows = val
    },
    getCompanyList() {
      // 数据处理
      // const temp = this.$cloneDeep(this.args)
      const temp = JSON.parse(JSON.stringify(this.args))
      const _this = this
      _this.tableLoading = true
      _this.loading = true
      console.log(temp, '查询参数123 getCompanyList')
      syncLogApi.list(this.args).then(res => {
        console.log(res)
        this.tableData = res.data.rows
        this.total = res.data.total
      }).catch(e => {
        console.log('err', e)
      }).finally(() => {
        this.loading = false
        this.tableLoading = false
      })
    },
    fn1(val) {
      console.log('fn1', val)
      this.args.offset = val
      this.getCompanyList()
    },
    fn2(val) {
      this.args.limit = val
      console.log('fn2', val)
      this.getCompanyList()
    },
    exportResult() { // 失败导出
      const _this = this
      const sheetData = JSON.parse(JSON.stringify(_this.selectedRows || '[]'))
      console.log(sheetData, 'sheetData')
      if (sheetData.length) {
        const header = _this.header
        const toExcel = new ExportJsonExcel({
          fileName: '物流时效数据' + _this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          datas: [{
            sheetData: sheetData,
            sheetName: 'sheet',
            sheetFilter: header.map(head => head.key),
            sheetHeader: header.map(head => head.title),
            columnWidths: ['10', '12', '6'] // 列宽
          }]
        })
        toExcel.saveExcel()
      } else {
        this.args.limit = 100
        timelinessApi.searchLogisticsLimitation(this.args).then(res => {
          if (res.data.success) {
            const datas = res.data.rows || []
            const toExcel = new ExportJsonExcel({
              fileName: '物流时效数据' + _this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              datas: [{
                sheetData: datas,
                sheetName: 'sheet',
                sheetFilter: _this.header.map(head => head.key),
                sheetHeader: _this.header.map(head => head.title),
                columnWidths: ['10', '12', '6'] // 列宽
              }]
            })
            toExcel.saveExcel()
          } else {
            this.$Message.error({ content: res.data.errorMsg || '时效报表查询服务端500', duration: 4 })
          }
        }).catch(e => {
          console.log('e:', e)
        }).finally(() => {
          this.args.limit = 10
        })
      }
    }
  }
}
</script>
<style lang="less">
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
