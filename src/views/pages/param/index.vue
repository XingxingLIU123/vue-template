<template lang="pug">
.app-container.layout-row.flex
    .content.layout-column.flex
      .filter-container
        el-form.filter-form(
        :model="filterForm"
        ref="filterForm"
        inline
        )
          .form-inline.filter-item.form-label
            el-form-item(label="模块名称:" prop="moduleName")
              el-select.filter-item(
              v-model="filterForm.moduleName"
              clearable
              )
                el-option(
                    v-for="list in moduleNameOptions"
                    :key="list.value"
                    :label="list.label"
                    :value="list.value")
            el-form-item(label="配置项名称:" prop="paramName")
              el-input(v-model="filterForm.paramName" clearable placeholder="请输入配置项名称")
            el-form-item(label="配置项key:" prop="paramKey")
              el-input(v-model="filterForm.paramKey" clearable placeholder="请输入配置项key")
            el-form-item.search-btn-group
              el-button.filter-item(type="primary" icon="el-icon-search") 查询
              el-button.filter-item(type="warning" icon="el-icon-refresh"  @click="resetForm('filterForm')") 重置
        .layout-row
            el-button.filter-item(type="primary" icon="el-icon-circle-plus-outline"  @click="handleCreate") 新增
            el-button.filter-item(type="danger" icon="el-icon-delete"  :disabled="deleteDisable") 批量删除
      el-table.flex.table-wrap(v-loading="listLoading"
        :data="list"
        border
        fit
        height="300"
        highlight-current-row
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange")
          el-table-column(type="selection" width="55"  align="center")
          el-table-column(label="配置项名字" fixed="left" align="center" width="180" prop="paramName")
          el-table-column(label="配置项key" align="center"  prop="paramKey")
          el-table-column(label="配置项值" align="center"  prop="paramVal")
          el-table-column(label="描述" align="center"  prop="des")
          el-table-column(fixed="right" width="180" label="操作" align="center" class-name="small-padding fixed-width")
              template(slot-scope="scope")
                  .btn-group
                  el-button(size="mini" type="primary" icon="el-icon-edit" title="编辑" @click="handleUpdate(scope.row)")
                  el-button(size="mini" type="danger" icon="el-icon-delete" title="删除")
      pagination(:total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList")
    el-dialog.dialog-style(
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        width="60%"
        )
        el-form(ref="filterForm" :model="temp" label-position="right" label-width="150px")
            .form-inline
                el-form-item(label="配置项名字:" prop="paramName")
                    el-input(v-model="temp.paramName")
                el-form-item(label="配置项key:" prop="paramKey")
                    el-input(v-model="temp.paramKey")
            .form-inline
                el-form-item(label="配置项值:" prop="paramVal")
                    el-input(v-model="temp.paramVal")
                el-form-item(label="描述:" prop="des")
                    el-input(v-model="temp.des")
        .dialog-footer(slot="footer")
            el-button( @click="dialogFormVisible = false")  取消
            el-button(type="primary"  @click="dialogStatus==='create'?createData():updateData()") 确认
</template>

<script>
import { fetchList } from '@/api/param'
import Pagination from '@/components/Pagination'
export default {
  name: 'Param',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      dialogStatus: '',
      delIds: [],
      deleteDisable: true,
      dialogFormVisible: false,
      textMap: {
        update: '参数管理-更新',
        create: '参数管理-添加'
      },
      listQuery: {
        page: 1,
        limit: 10,
        paramName: '',
        paramKey: ''
      },
      listLoading: false,
      filterForm: {
        moduleName: '',
        paramName: '',
        paramKey: ''
      },
      temp: {
        id: null, // INT 'id'
        paramName: null, // string '参数名'
        paramKey: null, // string '参数key'
        paramVal: null, // string '参数值'
        des: null // string '描述'
      },
      moduleNameOptions: [
        { value: '全局参数', label: '全局参数' },
        { value: '机构管理', label: '机构管理' },
        { value: '用户管理', label: '用户管理' },
        { value: '角色管理', label: '角色管理' },
        { value: '菜单管理', label: '菜单管理' },
        { value: '日志管理', label: '日志管理' },
        { value: '附件管理', label: '附件管理' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取数据method
    getList() {
      this.listLoading = true
      fetchList().then(res => {
        this.list = res.data.items
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 表格隔行换色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    // 多选
    handleSelectionChange(val) {
      val.length > 0 ? this.deleteDisable = false : this.deleteDisable = true
      this.delIds = []
      val.forEach(element => {
        this.delIds.push(element.id)
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * @description handleUpdate 创建一条新的数据（添加）
     * @param row:Object 当前需要编辑的原始数据
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['filterForm'].clearValidate()
      })
      console.log(row, this.temp)
    },
    /**
     * @description handleCreate 点击添加按钮
     */
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    resetTemp() {
      this.temp = {
        id: null, // INT 'id'
        paramName: null, // string '参数名'
        paramKey: null, // string '参数key'
        paramVal: null, // string '参数值'
        des: null // string '描述'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ 用于有scoped的style中覆盖 ui样式

</style>
