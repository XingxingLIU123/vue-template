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
          el-form-item(label="名称:" prop="name")
            el-input( placeholder="请输入名称" v-model="filterForm.name")
          el-form-item.search-btn-group
            el-button.filter-item(type="primary" icon="el-icon-search" @click="searchRole") 查询
            el-button.filter-item(type="warning" icon="el-icon-refresh" @click="resetFields") 重置
      .layout-row
        el-button(type="primary" icon="el-icon-circle-plus-outline" @click="addRole") 新增
        el-button(type="danger" icon="el-icon-delete" @click="deleteRole" :disabled="deleteDisable") 批量删除
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
      @onGetList="getTableList"
      @onModify="onModify"
      @onDelete="deleteRole"
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
import { tableList, deleteRoles, modifyRoles, addRoles } from '@/api/roles'
import ModifyDialog from '@/components/SimpleDialog'
import SimpleTable from '@/components/Table/SimpleTable'
export default {
  name: 'Roles',
  components: {
    SimpleTable,
    ModifyDialog
  },
  data() {
    return {
      deleteDisable: true,
      tableLoading: false,
      totalCount: 50,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined
      },
      columns: [
        {
          prop: 'name',
          label: '角色名称',
          align: 'center',
          width: 200
        },
        {
          prop: 'describe',
          label: '角色描述',
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
      // 角色操作按钮
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

      // 搜索条件
      filterForm: {
        name: ''
        // permission: ''
      },
      options: [],
      // 弹窗
      showDialog: false,
      // 角色参数
      formData: {
        name: '',
        describe: '',
        permission: []
      },
      // 弹窗表单配置项
      formItems: [
        { label: '角色名称', prop: 'name', input: true },
        { label: '角色描述', prop: 'describe', input: true },
        { label: '权限设置', prop: 'permission', tree: true, options: [] }
      ],
      diaLogformRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        describe: [
          { required: true, message: '请输入出生日期', trigger: 'blur' }
        ]
      },
      // 选中行的ID数组
      selectIds: [],
      isModify: false
    }
  },
  created() {
    this.getTableList()
  },
  mounted() {
    // 通知消息测试
    this.$showNotice('123', '1234')
  },
  methods: {
    /**
     * @auther
     * @description  getTableList 获取表格数据（获取
     */
    getTableList() {
      this.listLoading = true
      tableList(this.listQuery).then(res => {
        this.tableData = res.data.items
        this.totalCount = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    /**
     * @auther
     * @description getPermissionList 获取权限列表（获取)
     */
    getPermissionList() {
      var indexs = this.formItems.findIndex(item => {
        return item.prop === 'permission'
      })
      this.formItems[indexs].options = []
      this.options = this.formItems[indexs].options
      this.$store.dispatch('GetUserInfo').then(res => {
        const permission = res.data.permission
        this.formItems[indexs].options = permission
      })
    },
    /**
     * @auther
     * @description searchRole 搜索角色（搜索）
     * @param {String} [listQuery] 传给后台的筛选条件
     */
    searchRole() {
      this.listQuery.name = this.filterForm.name
      // this.listQuery.permission = this.filterForm.permission
      this.getTableList()
    },
    /**
     * @auther
     * @description resetFields 重置表单搜索条件（重置
     */
    resetFields() {
      this.$refs['filterForm'].resetFields()
      this.listQuery.name = undefined
      this.listQuery.permission = undefined
      this.getTableList()
    },
    /**
     * @auther
     * @description onSelectionChange 选择勾选框 (选择)
     * @param {Array} [val]  选项发生变化时,被勾选的项
     */
    onSelectionChange(val) {
      val.length > 0
        ? (this.deleteDisable = false)
        : (this.deleteDisable = true)
      this.selectIds = []
      val.map(role => {
        this.selectIds.push(role.id)
      })
    },
    /**
     * @auther
     * @description onModify 编辑表格 (编辑)
     * @param {Number} [index] 表格操作栏按钮的索引
     * @param {Object} [row] 当前行数据
     */
    onModify(index, row) {
      if (row) {
        this.isModify = true
        this.formData = Object.assign(this.formData, row)
        this.getPermissionList()
      } else {
        this.formData = {
          name: '',
          describe: '',
          // permission: 默认勾选项
          permission: []
        }
      }
      this.showDialog = true
    },
    /**
     * @auther
     * @description deleteRole 删除表格数据 (删除)
     * @param {Number} [index] 表格操作栏按钮的索引
     * @param {Object} [row] 当前行数据
     */
    deleteRole(index, row) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let id = []
          row ? id.push(row.id) : (id = this.selectIds)
          deleteRoles({ ids: JSON.stringify(id) }).then(res => {
            // console.log(res)
            this.getTableList()
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
    /**
     * @auther
     * @description addRole 添加表格数据 (添加)
     * @params
     */
    addRole() {
      this.isModify = false
      this.onModify()
    },
    /**
     * @auther
     * @description  onConfirm 提交添加/修改表单数据 (提交)
     * @param {Object} [formData] 角色参数
     */
    onConfirm(formData) {
      if (this.isModify) {
        modifyRoles(formData).then(res => {
          this.$message.success('修改成功')
          this.getTableList()
          this.showDialog = false
          this.isModify = false
        })
      } else {
        addRoles(formData).then(res => {
          this.$message.success('添加成功')
          this.getTableList()
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
