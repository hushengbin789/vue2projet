<template>
  <div class="login">
    <h1>This is an timeLiness page</h1>
    <Button type="info" @click="()=>{this.$router.go(-1)}">主页</Button>
    <Button type="info" @click="getCompanyList()">查询</Button>
    <Button type="info" @click="exportResult()">导出</Button>
    <Table border ref="selection" :columns="columnsTable" :data="DataList" @on-selection-change="selectTable">
      <template slot-scope="{ row }" slot="action3">
        <div style="position: relative;">
          <ul class="table_ul">
            <li>7天:&nbsp;{{row.sevenPrescriptionRate}}&nbsp;%&nbsp;</li>
            <li>30天:&nbsp;{{row.thirtyPrescriptionRate}}&nbsp;%&nbsp;</li>
          </ul>
          <ul class="table_ul">
            <li style="color: #FF3D00;">15天:&nbsp;{{row.fifteenPrescriptionRate}}&nbsp;%&nbsp;</li>
            <li style="color: #29B6F6;">60天:&nbsp;{{row.sixtyPrescriptionRate}}&nbsp;%&nbsp;</li>
          </ul>
        </div>
      </template>
    </Table>
    <Page :total="total" size="small" show-total show-elevator show-sizer :page-size-opts="[10, 20, 50, 200]"
      @on-change="fn1" @on-page-size-change="fn2"
    ></Page>
  </div>
</template>

<script>
import * as timelinessApi from '@/api/timeliness.api.js'
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
      DataList: [],
      columnsTable: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 60,
          // fixed: 'left',
          align: 'center'
        },
        {
          title: '物流商',
          key: 'shippingCompanyCode'
        },
        {
          title: '物流方式',
          key: 'shippingMethodCode',
          align: 'center',
          width: 240
        },
        {
          title: '国家',
          key: 'buyerCountryChineseName',
          align: 'center',
          width: 140
        },
        {
          title: '发货时间',
          key: 'defineLoadTime',
          align: 'center',
          width: 140
        }, {
          title: '总妥投平均时效',
          key: 'prescriptionAverage',
          align: 'center',
          width: 120
        }, {
          title: '7天妥投票数',
          key: 'sevenPrescription',
          align: 'center',
          width: 120
        }, {
          title: '30天妥投票数',
          key: 'thirtyPrescription',
          align: 'center',
          width: 130
        }, {
          title: '妥投率',
          key: 'netAverageDay',
          align: 'center',
          slot: 'action3',
          width: 240
        }, {
          title: '妥投率',
          key: 'sixtyPrescriptionRate',
          align: 'center',
          width: 240
        }
      ],
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
      timelinessApi.searchLogisticsLimitation(temp).then(res => {
        if (res.data.success) {
          this.DataList = res.data.rows
          this.total = res.data.total
        } else {
          this.$Message.error({ content: res.data.errorMsg || '时效报表查询服务端500', duration: 4 })
        }
      }).catch(e => {
        console.log('e:', e)
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
