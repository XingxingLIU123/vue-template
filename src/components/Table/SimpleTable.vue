<template lang="pug">
.table-wrap
  el-table(
    v-loading="listLoading"
    :data="list"
    border
    fit
    :height="height"
    highlight-current-row
    style="width: 100%;overflow-y: hidden;"
    :row-class-name="tableRowClassName"
    @selection-change="handleSelectionChange")
    el-table-column(
      v-if="hasSelection"
      type="selection",
      align="center"
      width="55"
      )
    el-table-column(
      v-for="column in columns"
      :header-align="column.headerAlign"
      show-overflow-tooltip
      :sortable="column.hasSort"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :fixed="column.fixed"
      :align="column.align"
      :width="column.width")
      template(slot-scope="scope")
        el-tag(v-if="column.status" :type="scope.row[column.prop] | statusFilter") {{ scope.row[column.prop] | lableFilter }}
        span(v-else) {{scope.row[column.prop]}}
    //- 操作
    el-table-column(
      :fixed="fixed"
      :width="operationWidth"
      label="操作"
      align="center"
      v-if="operation.length > 0"
      :class-name="operationClass")
      template(slot-scope="scope")
        .btn-group
          el-popover(
            v-if="hasPopover"
            placement="top-start"
            title="详情"
            width="200"
            trigger="hover"
            :content="scope.row.details")
              el-button(slot="reference" size="mini" type='success'
              icon="el-icon-tickets" style="margin-right: 10px")
          el-button(
            v-for="list in operation"
            :key="list.id"
            :type="list.type"
            :size="list.size"
            :icon="list.icon"
            :title="list.title"
            @click.stop="operationClick(scope.$index, scope.row, list.id)")

  pagination(
    :total="totalCount"
    :page.sync="listQuery.page"
    :limit.sync="listQuery.limit"
    @pagination="getList")
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'SimpleTable',
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    },
    lableFilter(status) {
      const statusMap = {
        '1': '启用',
        '2': '禁用'
      }
      return statusMap[status]
    }
  },
  props: {
    listLoading: {
      type: Boolean,
      default: false
    },
    // data
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否可以多选
    hasSelection: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 非常用情况
    hasPopover: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 表格的列
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    fixed: {
      type: String,
      default: 'right'
    },
    // 操作列的宽
    operationWidth: {
      type: String,
      default: '150'
    },
    // 操作列的样式
    operationClass: {
      type: String,
      default: 'small-padding fixed-width'
    },
    // 操作
    operation: {
      type: Array,
      default: function() {
        return []
      }
    },
    totalCount: {
      type: Number,
      default: 100
    },
    listQuery: {
      type: Object,
      default() {
        return {
          page: 1,
          limit: 20
        }
      }
    }
  },
  data() {
    return {
      height: 200

    }
  },
  mounted() {

  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    /**
     * @description handleSelectionChange 选择勾选框
     * @params val:Array 选项发生变化时,被勾选的项
     */
    handleSelectionChange(val) {
      this.$emit('onSelectionChange', val)
      console.log(`el-icon-${val}`)
    },
    /**
     * @description getList 获取列表
     */
    getList() {
      this.$emit('onGetList')
    },
    // 操作按钮的事件响应
    operationClick: function(index, row, id) {
      const data = this.operation
      // console.log(data)
      for (let i = 0; i < data.length; i++) {
        // 等于当前点击的按钮的时候触发事件
        if (id === data[i].id) {
          this.$emit(data[i].fn, index, row)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
