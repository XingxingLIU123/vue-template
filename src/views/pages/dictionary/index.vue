<template  lang="pug">
  .dictionary.app-container.layout-row.flex
    el-tree.flex-15.tree-warp(
      :data="treeData"
      :props="defaultProps"
      ref="dicTree"
      default-expand-all
      highlight-current
      @node-click="handleNodeClick"
      node-key='id')
        span.custom-tree-node.layout-row__between.icon-position(slot-scope="{ node, data }" )
          span {{ node.label }}
          i.el-icon-setting.tree-icon()
    .content.flex-85.layout-column
        .filter-container
            el-form.filter-form(
            :rules="rules"
            :model="ruleForm"
            ref="ruleForm"
            inline
            class="demo-ruleForm"
            )
              .form-inline.filter-item.form-label
                el-form-item.filter-item.form-label(prop="keyWord" label="名称：")
                  el-input( placeholder="关键字" v-model="ruleForm.keyWord" clearable @keyup.enter.native= "submitForm('ruleForm')")
                el-form-item.search-btn-group
                  el-button.filter-item(v-waves="" type="primary" icon="el-icon-search"  @click="submitForm('ruleForm')") 搜索
                  el-button.filter-item(type="warning" icon="el-icon-refresh"  @click="resetForm('ruleForm')") 重置
            .layout-row
              el-button( type="primary" icon="el-icon-upload2" ) 导入
              el-button( type="primary" icon="el-icon-download" ) 导出
              el-button( type="primary" icon="el-icon-circle-plus-outline"  @click="handleCreate") 添加
              el-button( type="danger"  icon="el-icon-delete" :disabled="deleteDisable" @click="deleteAll") 批量删除
        el-table.flex.table-wrap(v-loading="listLoading"
                    :data="tableList"
                    border
                    fit
                    height="300"
                    @sort-change='sortChange'
                    :span-method="arraySpanMethod"
                    highlight-current-row
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange")
              el-table-column(type="selection" width="55" align="center")
              el-table-column(label="字典键" fixed="left" align="center"  prop="key")
              el-table-column(label="字典层级" align="center"  prop="group")
              el-table-column(label="父级字典名" align="center"  prop="parentName" )
              el-table-column(label="字典值" sortable='custom'  align="center" prop="value")
              el-table-column(label="描述"  align="center" prop="desc")
              el-table-column(label="扩展值一" align="center"  prop="optional1")
              el-table-column(label="扩展值二" align="center"  prop="optional2" )
              el-table-column(label="扩展值三" align="center"  prop="optional3")
              el-table-column(label="扩展值四" align="center"  prop="optional4")
              el-table-column(label="扩展值五" align="center"  prop="optional5" )
              el-table-column(label="创建时间" align="center" show-overflow-tooltip prop="makeTime")
              el-table-column(label="更新时间" align="center" show-overflow-tooltip prop="updateTime")
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
            el-form-item(label="字典键：" prop="key")
              el-input(v-model="temp.key" :disabled="true")
            el-form-item(label="字典层级：" prop="group")
              el-input(v-model="temp.group")
          .form-inline
            el-form-item(label="父级字典名：" prop="parentName")
              el-input(v-model="temp.parentName")
            el-form-item(label="字典值：" prop="value")
              el-input(v-model.number="temp.value")
          .form-inline
            el-form-item(label="描述：" prop="desc")
              el-input(v-model="temp.desc")
            el-form-item(label="扩展值1：" prop="optional1")
              el-input(v-model="temp.optional1")
          .form-inline
            el-form-item(label="扩展值2：" prop="optional2")
              el-input(v-model="temp.optional2")
            el-form-item(label="扩展值3：" prop="optional3")
              el-input(v-model="temp.optional3")
          .form-inline
            el-form-item(label="扩展值4：" prop="optional4")
              el-input(v-model="temp.optional4")
            el-form-item(label="扩展值5：" prop="optional5")
              el-input(v-model="temp.optional5")
        .dialog-footer(slot="footer")
          el-button( @click="dialogFormVisible = false")  取消
          el-button(type="primary"  @click="dialogStatus==='create'?createData():updateData()") 确认
</template>
<script>
// 引用的接口API
import { fetchList } from '@/api/dic'
// 引用的波浪纹指令
import waves from '@/directive/waves'
// 引用的分页组件
import Pagination from '@/components/Pagination'
export default {
  name: 'Dict',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 表格数据
      tableList: [],
      // 过滤的表单配置项
      ruleForm: {
        keyWord: ''
      },
      // 排序的参数
      sortParam: {
        value: 'ascending'
      },
      // 批量删除禁用的参数
      deleteDisable: true,
      // 选择删除的数据id数组
      delIds: [],
      // 用作表单验证的规则
      rules: {
        keyWord: [
          { required: true, message: '请输入关键字', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        keyWord: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      // 控制dialog的标题配置项
      textMap: {
        update: '字典管理-更新',
        create: '字典管理-添加'
      },
      // tree的数据
      treeData: [
        {
          id: 15,
          label: '角色类别',
          disabled: true
        },
        {
          id: 14,
          label: '密级',
          disabled: true
        },
        {
          id: 13,
          label: '政治面貌',
          disabled: true
        },
        {
          id: 12,
          label: '机构类别',
          disabled: true
        }
      ],
      // tree的默认props
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 编辑/添加的表单参数
      temp: {
        id: null, // INT 'id'
        key: null, // string '字典键'
        group: null, // string '字典层级'
        parentName: null, // string '父级字典名'
        value: null, // string '字典值'
        desc: null, // string '描述'
        optional1: null, // string '扩展值1'
        optional2: null, // string '扩展值2'
        optional3: null, // string '扩展值3'
        optional4: null, // string '扩展值4'
        optional5: null, // string '扩展值5'
        makeTime: null, // string '创建时间'
        updateTime: null // string '更新时间'
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
    /**
     * @description sortChange  在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据
     * @param {Object} [column] 当前列的数据
     * @param {String} [prop]  以什么字段进行排序
     * @param {String} [order] 以什么方式排序
     */
    sortChange(column, prop, order) {
      this.sortParam[column.prop] = column.order
    },
    /**
     * @description arraySpanMethod  合并单元格
     * @param {Object} [row] 当前行的数据
     * @param {Object} [column] 当前列的数据
     * @param {Number} [rowIndex] 行索引
     * @param {Number} [columnIndex] 列索引
     */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 3) {
          return [1, 2]
        } else if (columnIndex === 4) {
          return [0, 0]
        }
      }
    },
    /**
     * @description tableRowClassName 表格隔行换色
     * @param {Object} [row] 当前行的数据
     * @param {Number} [rowIndex] 行索引
     */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    /**
     * @description handleNodeClick tree节点点击事件
     * @param {Object} [data] 当前点击节点的数据
     */
    handleNodeClick(data) {
      if (!data.children) {
        this.getList()
      }
    },
    /**
     * @description handleSelectionChange 批量删除
     * @param {Array} [val] 选择的数据
     */
    handleSelectionChange(val) {
      val.length > 0
        ? (this.deleteDisable = false)
        : (this.deleteDisable = true)
      this.delIds = []
      val.forEach(element => {
        this.delIds.push(element.id)
      })
    },
    /**
     * @description deleteAll 批量删除的方法
     * @param
     */
    deleteAll() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delIds.forEach(element => {
          const delItem = this.tableList.filter(item => element === item.id)
          this.tableList.splice(delItem, 1)
        })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    /**
     * @description submitForm 搜索
     * @param  {String} [formName] 表单ref
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.listQuery.keyWord = this.ruleForm.keyWord
        this.getList()
      })
    },
    /**
     * @description resetSerch 重置表单
     * @param  {String} [formName] 表单ref
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * @description resetTemp 重置弹框表格modal
     */
    resetTemp() {
      this.temp = {
        id: null, // INT 'id'
        key: null, // string '字典值'
        group: null, // string '字典层级'
        parentName: null, // string '父级字典名'
        value: null, // string '字典值'
        desc: null, // string '描述'
        optional1: null, // string '扩展值1'
        optional2: null, // string '扩展值2'
        optional3: null, // string '扩展值3'
        optional4: null, // string '扩展值4'
        optional5: null, // string '扩展值5'
        makeTime: null, // string '创建时间'
        updateTime: null // string '更新时间'
      }
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
     * @auther
     * @description handleUpdate 创建一条新的数据（添加）
     * @param row:Object 当前需要编辑的原始数据
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * @auther
     * @description getList 获取数据
     */
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.tableList = res.data.items
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    /**
     * @description createData 创建一条新的数据（添加）
     */
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.temp)
          const data = this.tableList
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
          this.tableList.forEach((item, i) => {
            if (item.id === param.id) {
              this.tableList[i] = param
            }
          })
          this.dialogFormVisible = false
          this.resetTemp()
        }
      })
    },
    /**
     * @description  deleteData 删除数据（删除）
     */
    deleteData(row) {
      const delList = this.tableList.filter(item => item.id !== row.id)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList = delList
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    /**
     * @description  setCheckedKeys 设置tree默认选中状态
     */
    setCheckedKeys() {
      this.$refs['dicTree'].setCurrentKey(15)
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ 用于有scoped的style中覆盖 ui样式
</style>
