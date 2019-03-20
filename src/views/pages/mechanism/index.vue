<template lang="pug">
.app-container.layout-row.flex
 el-tree.flex-15.tree-warp(
   :data="data"
   :props="defaultProps"
   ref="mechanismTree"
   default-expand-all
   highlight-current
   @node-click="handleNodeClick"
   node-key='id')
    span.custom-tree-node.layout-row__between.icon-position(slot-scope="{ node, data }")
      span {{ node.label }}
      i.el-icon-setting.tree-icon()
 .content.flex-85.layout-column
    .filter-container
      el-form.filter-form.demo-ruleForm(
      :model="ruleForm"
      ref="ruleForm"
      inline
      )
        .form-inline.filter-item.form-label
          el-form-item.filter-item.form-label(prop="keyWord" label="名称：")
            el-input.filter-item( placeholder="关键字" v-model="ruleForm.keyWord" clearable )
          el-form-item.search-btn-group
            el-button.filter-item( type="primary"  icon="el-icon-search" ) 搜索
            el-button.filter-item( type="warning"  icon="el-icon-refresh" @click="resetForm('ruleForm')") 重置
      .layout-row
        el-button.filter-item( type="primary"  icon="el-icon-upload2" ) 导入
        el-button.filter-item( type="primary"  icon="el-icon-download" ) 导出
        el-button.filter-item( type="primary"  icon="el-icon-circle-plus-outline"   @click="handleCreate") 添加
        el-button.filter-item( type="danger"   icon="el-icon-delete" :disabled="deleteDisable") 批量删除
    el-table.flex.table-wrap(v-loading="listLoading"
          :data="list"
          border
          fit
          height="300"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange")
      el-table-column(type="selection" width="55" align="center")
      el-table-column(label="机构名" fixed="left" align="center" width="180" prop="jgm")
      el-table-column(label="机构代码" align="center"  prop="jgdm")
      el-table-column(label="机构地址" align="center"  prop="jgdz" )
      el-table-column(label="机构负责人" align="center"  prop="jgfzr")
        template(slot-scope='scope')
          el-popover(trigger='hover', placement='top')
            p 姓名: {{ scope.row.jgfzr }}
            p 机构名: {{ scope.row.jgm }}
            p 机构地址: {{ scope.row.jgdz }}
            .name-wrapper(slot='reference')
              el-tag(size='medium' ) {{ scope.row.jgfzr }}
      el-table-column(label="创建时间"  show-overflow-tooltip align="center"  prop="makeTime")
      el-table-column(label="更新时间" align="center"  prop="updateTime")
      el-table-column(fixed="right" width="180" label="操作" align="center" class-name="small-padding fixed-width")
        template(slot-scope="scope")
          .btn-group
            el-button(type="primary" size= 'mini', icon="el-icon-edit" title="编辑"  @click="handleUpdate(scope.row)")
            el-button(type="danger" size= 'mini', icon="el-icon-delete" title="删除" @click="deleteData(scope.row)")
    pagination(:total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList")
 el-dialog.dialog-style(
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
    width="60%"
    )
    el-form(ref="dataForm" :model="temp" label-position="right" label-width="150px")
      .form-inline
        el-form-item(label="机构名：" prop="jgm")
          el-input(v-model="temp.jgm")
        el-form-item(label="机构代码：" prop="jgdm")
          el-input(v-model="temp.jgdm")
      .form-inline
        el-form-item(label="机构地址：" prop="jgdz")
          el-input(v-model="temp.jgdz")
        el-form-item(label="机构负责人：" prop="jgfzr")
          el-input(v-model="temp.jgfzr")
    .dialog-footer(slot="footer")
      el-button( @click="dialogFormVisible = false")  取消
      el-button(type="primary"  @click="dialogStatus==='create'?createData():updateData()") 确认
</template>
<script>
import { fetchList } from '@/api/mechanism'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Mechanism',
  components: { Pagination },
  data() {
    return {
      list: [],
      deleteDisable: true,
      listLoading: false,
      delIds: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      ruleForm: {
        keyWord: '' // 关键字
      },
      textMap: {
        update: '机构管理-更新',
        create: '机构管理-添加'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: null, // INT 'id'
        jgm: null, // string '机构名'
        jgdm: null, // string '机构代码'
        jgdz: null, // string '机构地址'
        jgfzr: null, // string '机构负责人'
        makeTime: null, // string '创建时间'
        updateTime: null // string '更新时间'
      },
      data: [
        {
          id: 15,
          label: '东部战区',
          disabled: true,
          children: [
            {
              id: 1,
              label: '第11集团军'
            },
            {
              id: 2,
              label: '第1集团军'
            },
            {
              id: 3,
              label: '第3集团军'
            }
          ]
        },
        {
          id: 14,
          label: '西部战区',
          disabled: true,
          children: [
            {
              id: 4,
              label: '第5集团军'
            },
            {
              id: 5,
              label: '第6集团军'
            },
            {
              id: 6,
              label: '第7集团军'
            }
          ]
        },
        {
          id: 13,
          label: '南部战区',
          disabled: true,
          children: [
            {
              id: 7,
              label: '第14集团军'
            },
            {
              id: 8,
              label: '第16集团军'
            },
            {
              id: 9,
              label: '第33集团军'
            }
          ]
        },
        {
          id: 12,
          label: '北部战区',
          disabled: true,
          children: [
            {
              id: 10,
              label: '第41集团军'
            },
            {
              id: 11,
              label: '第19集团军'
            },
            {
              id: 12,
              label: '第32集团军'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(function() {
      this.setCheckedKeys()
    })
  },
  methods: {
    // 表格隔行换色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    /**
     * @description resetTemp 重置弹框表格modal
     */
    resetTemp() {
      this.temp = {
        id: null, // INT 'id'
        jgm: null, // string '机构名'
        jgdm: null, // string '机构代码'
        jgdz: null, // string '机构地址'
        jgfzr: null, // string '机构负责人'
        makeTime: null, // string '创建时间'
        updateTime: null // string '更新时间'
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 多选
    handleSelectionChange(val) {
      val.length > 0 ? this.deleteDisable = false : this.deleteDisable = true
      this.delIds = []
      val.forEach(element => {
        this.delIds.push(element.id)
      })
    },
    // tree
    handleNodeClick(data) {
      console.log(data)
      if (!data.children) {
        this.getList()
      }
    },
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
    /**
     * @description handleCreate 点击添加按钮
     */
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    /**
     * @description handleUpdate 创建一条新的数据（添加）
     * @param row:Object 当前需要编辑的原始数据
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    /**
     * @description createData 创建一条新的数据（添加）
     */
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.temp)
          const data = this.list
          param.id = data[data.length - 1].id + 1 // id自增
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.resetTemp()
          this.dialogFormVisible = false
          const makeTime = this.$day().format('YYYY-MM-DD HH:mm:ss')
          param.makeTime = makeTime
          data.push(param)
        }
      })
    },
    /**
     * @description updateData 更新数据（编辑）
     */
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.temp)
          const updateTime = this.$day().format('YYYY-MM-DD HH:mm:ss')
          param.updateTime = updateTime
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.resetTemp()
          this.dialogFormVisible = false
          this.list.find(item => item.id === param.id).updateTime = updateTime
        }
      })
    },
    // 删除数据method
    deleteData(row) {
      const delList = this.list.filter(item => item.id !== row.id)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = delList
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    setCheckedKeys() {
      this.$refs['mechanismTree'].setCurrentKey(15)
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ 用于有scoped的style中覆盖 ui样式

</style>
