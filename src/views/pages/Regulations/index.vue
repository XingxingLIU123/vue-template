<template lang="pug">
.regulations.app-container.layout-row.flex
  .content.layout-column.flex
    .filter-container
      el-form.filter-form(
        :model="filterForm"
        ref="filterForm"
        :inline="true"
        )
        .form-inline.filter-item.form-label
          el-form-item(label="关键字:" prop="name")
            el-input.filter-item(
                placeholder="请输入关键字"
                v-model="filterForm.keyword"
                @keyup.enter.native="search"
                clearable
                )
          el-form-item.search-btn-group
              el-button(
                type="primary"
                icon="el-icon-search"
                @click="search") 查询
              el-button(
                type="warning"
                icon="el-icon-refresh"
                  @click="reset") 重置
      .layout-row
        el-button.filter-item(
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="add") 新增
        el-button(
          type="primary"
          icon="el-icon-upload2"
          @click="") 导入
        el-button(
          type="danger"
          icon="el-icon-delete"
          @click="onDelete"
          :disabled="deleteDisable") 批量删除
    simple-table(
      :listLoading="tableLoading"
      :columns="columns"
      :list="tableData"
      :hasSelection='true'
      :hasPopover="false"
      :operation="operation"
      :operationWidth="operationWidth"
      :totalCount="totalCount"
      :listQuery="listQuery"
      @onGetList="onGetTableList"
      @onModify="onModify"
      @onDelete="onDelete"
      @onSelectionChange="onSelectionChange"
    )
  modify-dialog(
    :show="showDialog"
    @onClose="showDialog = false"
    @onConfirm="onConfirm"
    :formData="formData"
    :items="formItems"
    :rules="diaLogformRules"
  )
</template>

<script>
import {
  getRegulations,
  deleteRegulations,
  modifyRegulations,
  addRegulations
} from '@/api/regulations'
import ModifyDialog from '@/components/SimpleDialog'
import SimpleTable from '@/components/Table/SimpleTable'
export default {
  name: 'Regulations',
  title:'法制法规',
  icon:'iconfont iconfaguichaxun',
  components: {
    SimpleTable,
    ModifyDialog
  },
  data() {
    return {
      deleteDisable: true,
      tableLoading: false,
      totalCount: 50,
      // 列表查询参数
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined
      },
      columns: [
        {
          prop: 'legalSystem',
          label: '法规制度',
          align: 'center',
          fixed: 'fixed',
          width: 200
        },
        {
          prop: 'regulationsCategory',
          label: '法规类别',
          align: 'center'
        },
        {
          prop: 'rules',
          label: '法规内容',
          align: 'center'
        },
        {
          prop: 'units',
          label: '法规颁发单位',
          align: 'center'
        },
        {
          prop: 'issueTime',
          label: '颁发时间',
          align: 'center'
        },
        {
          prop: 'phone',
          label: '联系电话',
          align: 'center'
        },
        {
          prop: 'createdTime',
          label: '创建时间',
          align: 'center'
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
          align: 'center'
        }
      ],
      tableData: [],
      operationWidth: '300',
      operation: [
        {
          type: 'primary',
          size: 'mini',
          icon: 'el-icon-edit',
          title: '编辑',
          id: 1,
          fn: 'onModify'
        },
        {
          type: 'danger',
          size: 'mini',
          icon: 'el-icon-delete',
          title: '删除',
          id: 2,
          fn: 'onDelete'
        }
      ],

      // 表单
      filterForm: {
        keyword: ''
      },

      // 弹窗
      showDialog: false,
      formData: {
        legalSystem: '',
        regulationsCategory: '',
        rules: '',
        phone: '',
        issueTime: '',
        units: ''
      },
      formItems: [
        { label: '法规制度', prop: 'legalSystem', input: true, type: 'text' },
        {
          label: '法规类别',
          prop: 'regulationsCategory',
          input: true,
          type: 'text'
        },
        { label: '法规内容', prop: 'rules', input: true, type: 'text' },
        { label: '法规颁发单位', prop: 'units', input: true, type: 'text' },
        { label: '颁发时间', prop: 'issueTime', time: true, type: 'date' },
        { label: '联系电话', prop: 'phone', input: true, type: 'number' }
      ],
      diaLogformRules: {
        legalSystem: [
          { required: true, message: '请输入法规制度', trigger: 'blur' }
        ],
        regulationsCategory: [
          { required: true, message: '请输入法规类别', trigger: 'blur' }
        ],
        rules: [{ required: true, message: '请输入法规内容', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        units: [
          { required: true, message: '请输入法规颁发单位', trigger: 'blur' }
        ],
        issueTime: [
          { required: true, message: '请选择颁发时间', trigger: 'change' }
        ]
      },

      // 表格
      selectIds: [],
      isModify: false
    }
  },
  created() {
    this.onGetTableList()
  },
  mounted() {},
  methods: {
    /**
     * @description onGetTableList 获取表格列表
     */
    onGetTableList() {
      this.tableLoading = true
      getRegulations(this.listQuery).then(res => {
        this.tableData = res.data.items
        this.totalCount = res.data.total
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    // 搜索
    search() {
      !this.filterForm.keyword && this.$message.error('请输入需要搜索的内容！')
      this.listQuery.keyword = this.filterForm.keyword
      this.onGetTableList()
    },
    // 重置搜索条件
    reset() {
      this.$refs['filterForm'].resetFields()
      this.listQuery.keyword = undefined
      this.onGetTableList()
    },
    /**
     * @description onSelectionChange 表格勾选时
     * @param {Array} [val] 被勾选的数据行
     */
    onSelectionChange(val) {
      val.length > 0
        ? (this.deleteDisable = false)
        : (this.deleteDisable = true)
      this.selectIds = []
      val.map(user => {
        this.selectIds.push(user.id)
      })
    },
    /**
     * @description onModify 编辑行
     * @param {Object} [row] 点击修改按钮的行的数据
     */
    onModify(index, row) {
      // console.log(row)
      if (row) {
        this.isModify = true
        this.formData = Object.assign(this.formData, row)
      } else {
        this.formData = {
          legalSystem: '',
          regulationsCategory: '',
          rules: '',
          phone: '',
          issueTime: '',
          units: ''
        }
      }
      this.showDialog = true
    },
    /**
     * @description onDelete 删除行
     * @param {Object} [row] 点击删除按钮的行的数据
     */
    onDelete(index, row) {
      this.$confirm('删除无法恢复，确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let id = []
          row ? id.push(row.id) : (id = this.selectIds)
          deleteRegulations({ ids: JSON.stringify(id) }).then(res => {
            // console.log(res)
            this.onGetTableList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加
    add() {
      this.isModify = false
      this.onModify()
    },
    /**
     * @description onConfirm 表单提交
     * @param {Object} [formData] 表单数据
     */
    onConfirm(formData) {
      if (this.isModify) {
        modifyRegulations(formData).then(res => {
          this.$message.success('修改成功')
          this.onGetTableList()
          this.showDialog = false
          this.isModify = false
        })
      } else {
        addRegulations(formData).then(res => {
          this.$message.success('添加成功')
          this.onGetTableList()
          this.showDialog = false
          this.isModify = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
