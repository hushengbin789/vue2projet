<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <Page
      :current="currentPage"
      :page-size.sync="pageSize"
      :page-size-opts="pageSizes"
      :total="total"
      size="small"
      show-total
      show-elevator
      show-sizer
      @on-page-size-change="handleSizeChange"
      @on-change="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    offset: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 100, 200]
      }
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage() {
      return (this.currentOffset / this.pageSize) + 1
    },
    currentOffset: {
      get() {
        return this.offset
      },
      set(val) {
        this.$emit('update:offset', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.currentOffset = (val - 1) * this.pageSize
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding-left: 10px;
}
.pagination-container.hidden {
  display: none;
}
</style>
