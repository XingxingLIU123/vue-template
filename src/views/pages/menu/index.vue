<template lang="pug">
.menu.app-container.layout-row.flex
  el-tree.tree-warp.flex-15(
    :data="treeData"
    :props="defaultProps"
    highlight-current
    node-key="id"
    ref='tree'
    @node-click="handleNodeClick")
    span.custom-tree-node.layout-row__between.icon-position(slot-scope="{ node, data }")
        span {{ node.label }}
        i.el-icon-setting.tree-icon(@click.stop="editTreeNode(data)" )
  .content.layout-column.flex.flex-85
    el-form(
      style="width:60%;"
      :model="filterForm"
      ref="filterForm"
      inline
      label-width="80px"
      label-position="left"
      )
      el-form-item(label="权限名称:")
        el-input.filter-item(
          placeholder="请输入权限名称"
          v-model="filterForm.name"
          style="width: 200px;"
          clearable
          @clear="reset")
        el-button.filter-item(
          type="primary"
          icon="el-icon-search"
          style="margin-left: 10px;"
          @click="search") 搜索

    simple-table(
      :listLoading="tableLoading"
      :columns="columns"
      :list="tableData"
      :hasSelection='false'
      :hasPopover="true"
      :operation="operation"
      :operationWidth="operationWidth"
      :totalCount="totalCount"
      :listQuery="listQuery"
      @onGetList="onGetTableList"
      @onModify="onModify"
    )
  modify-dialog(
    :show="showDialog"
    @onClose="showDialog = false"
    :form="formData"
  )
  el-dialog(
    title="编辑"
    :visible.sync="dialogVisible"
    width="30%")
    .dialog-content.layout-row
      span 菜单名称：
      el-input(v-model="editTreeData.label" size="small" style="width: 300px;margin-lift:20px;")
    span.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(@click="treeSubmit" type="primary") 确定
</template>

<script>
import { list, tableList, modifyTree } from '@/api/menu'
import ModifyDialog from './ModifyDialog'
import SimpleTable from '@/components/Table/SimpleTable'
export default {
  name: 'Menu',
  components: {
    SimpleTable,
    ModifyDialog
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 被点中的树id
      types: 1,

      tableLoading: false,
      totalCount: 50,
      // 查询条件
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined
      },
      columns: [
        {
          prop: 'permission',
          label: '操作',
          align: 'center',
          width: 200
        },
        {
          prop: 'permissionId',
          label: '操作ID',
          align: 'center',
          width: 100
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
        { type: 'primary', size: 'mini', icon: 'el-icon-edit', title: '编辑', id: 1, fn: 'onModify' }
      ],

      // 表单
      filterForm: {
        name: ''
      },

      // 弹窗
      showDialog: false,
      formData: {
        permission: '',
        permissionId: '',
        createdTime: '',
        modifyTime: ''
      },

      // 树名称修改弹窗
      editTreeData: {
        id: '',
        label: ''
      },
      dialogVisible: false
    }
  },
  created() {
    this.getTreeList()
  },
  mounted() {
    this.$nextTick(function() {
      this.$refs.tree.setCurrentKey(1)
    })
  },
  methods: {
    /**
     * @description getTreeList 获取树列表
     */
    getTreeList() {
      list().then((res) => {
        this.treeData = res.data
        this.types = this.treeData[0].id
        this.onGetTableList()
        this.$nextTick(function() {
          this.$refs.tree.setCurrentKey(1)
        })
      })
    },
    /**
     * @description handleNodeClick 被选中的树
     * @param {Object} [val] (id, lable) 点击的行的数据
     */
    handleNodeClick(val) {
      this.types = val.id
      this.onGetTableList()
    },
    /**
     * @description onGetTableList 获取表格数据
     */
    onGetTableList() {
      this.listLoading = true
      tableList(this.types, this.listQuery).then(res => {
        this.tableData = res.data.items
        this.totalCount = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 搜索
    search() {
      this.listQuery.title = this.filterForm.name
      this.onGetTableList()
    },
    // 重置搜索表单
    reset() {
      this.listQuery.title = undefined
      this.onGetTableList()
    },
    /**
     * @description onModify 编辑行
     * @param {Object} [row] 点击修改按钮的行的数据
     */
    onModify(index, row) {
      this.showDialog = true
      this.formData = row
    },
    /**
     * @description editTreeNode 编辑树节点
     * @param {Object} [data] (id, label)被点击的树节点的数据
     */
    editTreeNode(data) {
      this.dialogVisible = true
      this.editTreeData = JSON.parse(JSON.stringify(data))
    },
    // 确定修改
    treeSubmit() {
      modifyTree(this.editTreeData).then(res => {
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu{
  .dialog-content{
    align-items: center;
    padding-left: 20px;
  }
}
</style>
