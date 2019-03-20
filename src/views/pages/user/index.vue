<template lang="pug">
.user.app-container(style="display:flex;flex:1")
  .content(style="width:100%;")
    el-form(
      style="width:60%;"
      :model="filterForm"
      ref="filterForm"
      :inline="true"
      label-width="120px"
      label-position="right"
      )
      el-form-item(label="名称:" prop="name")
        el-input.filter-item( placeholder="请输入名称" v-model="filterForm.name" style="width: 200px; margin-right: 20px")
      el-form-item(label="单位:" prop="management")
        el-input.filter-item(
          placeholder="请输入名称"
          v-model="filterForm.management"
          style="width: 200px;")
      el-form-item
          el-button.filter-item(
            type="primary"
            icon="el-icon-search"
            style="margin-left: 10px;"
            @click="search") 查询
          el-button.filter-item(
            type="warning"
            icon="el-icon-refresh"
            style="margin-left: 10px;"
            @click="reset") 重置
    .layout-row(style="margin-bottom: 15px")
      el-button.filter-item(
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="add") 新增
      el-button(
        type="danger"
        icon="el-icon-delete"
        style="margin-left: 10px;"
        @click="onDelete"
        :disabled="deleteDisable") 批量删除
    .table-warp
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
import { tableList, deleteUser, modifyUser, addUser } from '@/api/user'
import ModifyDialog from '@/components/SimpleDialog'
import SimpleTable from '@/components/Table/SimpleTable'
export default {
  name: 'User',
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
        limit: 10,
        name: undefined,
        management: undefined
      },
      columns: [
        {
          prop: 'name',
          label: '姓名',
          align: 'center',
          width: 200
        },
        {
          prop: 'birthday',
          label: '出生日期',
          align: 'center',
          width: 100
        },
        {
          prop: 'management',
          label: '单位',
          align: 'center'
        },
        {
          prop: 'phone',
          label: '联系电话',
          align: 'center'
        },
        {
          prop: 'role',
          label: '角色',
          align: 'center'
        },
        {
          prop: 'state',
          label: '状态',
          align: 'center',
          status: true
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
        { type: 'primary', size: 'mini', icon: 'el-icon-edit', title: '编辑', id: 1, fn: 'onModify' },
        { type: 'danger', size: 'mini', icon: 'el-icon-delete', title: '删除', id: 2, fn: 'onDelete' }
      ],

      // 表单
      filterForm: {
        name: '',
        management: ''
      },

      // 弹窗
      showDialog: false,
      formData: {
        name: '',
        birthday: '',
        management: '',
        phone: '',
        role: '',
        state: '1'
      },
      formItems: [
        { label: '姓名', prop: 'name', input: true },
        { label: '出生日期', prop: 'birthday', input: true },
        { label: '单位', prop: 'management', input: true },
        { label: '联系电话', prop: 'phone', input: true },
        { label: '角色', prop: 'role', select: true, options: [] },
        { label: '状态', prop: 'state', radio: true, options: [{ label: '启用', value: '1' }, { value: '2', label: '禁用' }] }
      ],
      diaLogformRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        birthday: [{ required: true, message: '请输入出生日期', trigger: 'blur' }],
        management: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        role: [{ required: true, message: '请输入电话', trigger: 'change' }]
      },

      // 表格
      selectIds: [],
      isModify: false
    }
  },
  created() {
    this.onGetTableList()
  },
  mounted() {

  },
  methods: {
    /**
     * @description onGetTableList 获取表格列表
     */
    onGetTableList() {
      this.listLoading = true
      tableList(this.listQuery).then(res => {
        this.tableData = res.data.items
        this.totalCount = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 搜索
    search() {
      this.listQuery.name = this.filterForm.name
      this.listQuery.management = this.filterForm.management

      this.onGetTableList()
    },
    // 重置搜索条件
    reset() {
      this.$refs['filterForm'].resetFields()
      this.listQuery.name = undefined
      this.listQuery.management = undefined
      this.onGetTableList()
    },
    /**
     * @description onSelectionChange 表格勾选时
     * @param {Array} [val] 被勾选的数据行
     */
    onSelectionChange(val) {
      val.length > 0 ? this.deleteDisable = false : this.deleteDisable = true
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
          birthday: '',
          management: '',
          phone: '',
          role: '',
          state: '1'
        }
      }
      var indexs = this.formItems.findIndex(item => {
        return item.prop === 'role'
      })
      this.formItems[indexs].options = []
      this.$store.dispatch('GetUserInfo').then((res) => {
        const roles = res.data.controlRoles
        roles.map(item => {
          this.formItems[indexs].options.push({
            label: item,
            value: item
          })
        })
        this.showDialog = true
      })
    },
    /**
     * @description onDelete 删除行
     * @param {Object} [row] 点击删除按钮的行的数据
     */
    onDelete(index, row) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = []
        row ? id.push(row.id) : id = this.selectIds
        deleteUser({ ids: JSON.stringify(id) }).then((res) => {
          // console.log(res)
          this.onGetTableList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
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
        modifyUser(formData).then(res => {
          this.$message.success('修改成功')
          this.onGetTableList()
          this.showDialog = false
          this.isModify = false
        })
      } else {
        addUser(formData).then(res => {
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
.user{
  .content{
    display: flex;
    flex: 1;
    flex-direction: column;
    /deep/ .el-form-item{
      margin-bottom: 10px
    }
    .table-warp{
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  }
}
</style>
