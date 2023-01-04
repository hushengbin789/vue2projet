import Vue from 'vue'
import XEUtils from 'xe-utils'
import {
  VXETable,
  Pager,
  Filter,
  Checkbox,
  Header,
  Column,
  Tooltip,
  Loading,
  Grid,
  Edit,
  Select,
  Validator,
  Table
} from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import 'vxe-table/lib/index.css'
import '../assets/table/style.css'

// 导入默认的国际化（如果项目中使用多语言，则应该导入到 vue-i18n 中）
VXETable.setup({
  i18n: key => XEUtils.get(zhCN, key)
})

// 按需导入依赖的模块
Vue.use(Pager)
Vue.use(Filter)
Vue.use(Checkbox)
Vue.use(Header)
Vue.use(Column)
Vue.use(Tooltip)
Vue.use(Loading)
Vue.use(Grid)
Vue.use(Select)
Vue.use(Edit)
Vue.use(Validator)
// 最后安装核心库
Vue.use(Table)

// 全局参数配置
VXETable.setup({
  // 表格的全局参数
  size: 'small',
  // showOverflow: null,
  // showHeaderOverflow: null,
  align: 'center',
  // headerAlign: null,
  stripe: true,
  border: true,
  resizable: true,
  // showHeader: true,
  // highlightCurrentRow: false,
  highlightHoverRow: true,
  highlightCurrentColumn: false,
  // highlightHoverColumn: false,
  // zIndex: 100, // 全局 zIndex 起始值
  // keepSource: false,
  // rowId: '_XID',
  // 分页的全局参数
  pager: {
    // perfect: true,
    align: 'left',
    size: 'mini',
    pageSize: 10,
    pagerCount: 5,
    pageSizes: [10, 50, 100, 300, 500, 1000],
    layouts: ['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'FullJump'] // 非常灵活的分页布局，支持任意位置随意换
  },
  // 优化的全局参数
  optimization: {
    // animat: true,
    // delayHover: 250,
    // scrollX: {
    //   gt: 40
    // },
    scrollY: {
      gt: 100
    }
  }
})

export default VXETable
