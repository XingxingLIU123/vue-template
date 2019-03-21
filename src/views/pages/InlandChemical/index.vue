<template lang="pug">
.inland-chemical.app-container.layout-row.flex
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
  getInlandChemical,
  deleteInlandChemical,
  modifyInlandChemical,
  addInlandChemical
} from '@/api/inlandChemical'
import ModifyDialog from '@/components/SimpleDialog'
import SimpleTable from '@/components/Table/SimpleTable'
export default {
  name: 'InlandChemical',
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
          prop: 'name',
          label: '名称',
          align: 'center',
          fixed: 'fixed',
          width: 200
        },
        {
          prop: 'category',
          label: '类别',
          align: 'center'
        },
        {
          prop: 'address',
          label: '地址',
          align: 'center'
        },
        {
          prop: 'productivity',
          label: '年生产力',
          align: 'center'
        },
        {
          prop: 'majorHazardSources',
          label: '主要危险源种类',
          align: 'center'
        },
        {
          prop: 'reserves',
          label: '储量',
          align: 'center'
        },
        {
          prop: 'riskAreaAssessment',
          label: '危险范围评估',
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
        name: '',
        category: '',
        productivity: '',
        majorHazardSources: '',
        reserves: '',
        address: '',
        riskAreaAssessment: ''
      },
      formItems: [
        { label: '名称', prop: 'name', input: true, type: 'text' },
        {
          label: '类别',
          prop: 'category',
          input: true,
          type: 'text'
        },
        { label: '地址', prop: 'address', input: true, type: 'text' },
        { label: '年生产力', prop: 'productivity', input: true, type: 'text' },
        { label: '储量', prop: 'reserves', input: true, type: 'text' },
        {
          label: '主要危险源种类',
          prop: 'majorHazardSources',
          input: true,
          type: 'text'
        },
        {
          label: '危险范围评估',
          prop: 'riskAreaAssessment',
          input: true,
          type: 'text'
        }
      ],
      diaLogformRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        category: [{ required: true, message: '请输入类别', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        productivity: [
          { required: true, message: '请输入年生产力', trigger: 'blur' }
        ],
        majorHazardSources: [
          { required: true, message: '请输入主要危险源种类', trigger: 'blur' }
        ],
        reserves: [{ required: true, message: '请输入储量', trigger: 'blur' }],
        riskAreaAssessment: [
          { required: true, message: '请输入危险范围评估', trigger: 'blur' }
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
      getInlandChemical(this.listQuery).then(res => {
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
          name: '',
          category: '',
          productivity: '',
          majorHazardSources: '',
          reserves: '',
          address: '',
          riskAreaAssessment: ''
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
          deleteInlandChemical({ ids: JSON.stringify(id) }).then(res => {
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
        modifyInlandChemical(formData).then(res => {
          this.$message.success('修改成功')
          this.onGetTableList()
          this.showDialog = false
          this.isModify = false
        })
      } else {
        addInlandChemical(formData).then(res => {
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
