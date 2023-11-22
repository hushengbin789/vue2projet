<template>
  <Select ref="sel" v-model="vals" @on-change="onChange" @on-clear="onClear" @on-query-change="onQueryChange" @on-open-change="onOpenChange" :disabled="disabled" :multiple="multiple" :maxTagCount="maxTagCount" :placeholder="placeholder" :clearable="clearable" :filterable="filterable">
    <Option v-for="item in showList" :value="item.val||''" :key="item.label||''">{{ item.label.split('*')[0] }}</Option>
  </Select>
</template>

<script>
export default {
  name: 'estone-select',
  props: {
    list: Array,
    val: [Array, String, Number],
    placeholder: String,
    clearable: Boolean,
    filterable: Boolean,
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxTagCount: {
      type: [Number],
      require: false,
      default: 1
    }
  },
  data() {
    return {
      vals: this.val,
      showList: [],
      val2: undefined
    }
  },
  activated() {
  },
  watch: {
    vals(val) {
      this.$emit('change-data', val)
    },
    list: function(newVal) {
      const _this = this
      if (!newVal) return
      let showList = this.list.slice(0, 60)
      if (Array.isArray(_this.val)) { // 多选
        if (_this.val.length) {
          showList = [...showList, ...this.list.filter(item => _this.val.some(it => it === item.val)).filter(item => showList.some(it => it.val !== item.val))]
        }
      } else { // 单选
        let item = showList.find(item => item.val === this.val)
        if (_this.val && !item) {
          let item = _this.list.find(item => item.val === this.val)
          if (item) {
            showList.push(item)
          }
        }
      }
      _this.showList = [...new Set(showList)]
    },
    val: function(newVal) {
      const _this = this
      _this.vals = newVal
      this.val2 = this.val
      if (!newVal) return
      let showList = this.list.slice(0, 60)
      if (Array.isArray(_this.val)) { // 多选
        if (_this.val.length) {
          showList = [...showList, ...this.list.filter(item => _this.val.some(it => it === item.val)).filter(item => showList.some(it => it.val !== item.val))]
        }
      } else { // 单选
        let item = showList.find(item => item.val === this.val)
        if (_this.val && !item) {
          let item = _this.list.find(item => item.val === this.val)
          if (item) {
            showList.push(item)
          }
        }
      }
      _this.showList = [...new Set(showList)]
    }
  },
  methods: {
    onClear() {
      this.val2 = undefined
    },
    onChange(val) {
      this.val2 = val
    },
    onQueryChange(val) {
      if (!val) return
      val = val.trim().toLowerCase()
      // this.showList = this.list.filter(item => String(item.label).toLowerCase().indexOf(val) > -1)
      this.showList = this.list.filter(item => {
        const labelContainsVal = String(item.label).toLowerCase().indexOf(val) > -1
        const valContainsVal = String(item.val).toLowerCase().indexOf(val) > -1

        return labelContainsVal || valContainsVal
      })
    },
    onOpenChange(isOpen) {
      if (!isOpen) {
        this.$emit('on-change', this.val2)
      }
    }
  }
}
</script>

<style scoped>
</style>
