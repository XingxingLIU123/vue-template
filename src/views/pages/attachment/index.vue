<template lang="pug">
.app-container.layout-row.flex
  .content.layout-column.flex
    .filter-container.layout-row
      el-form.filter-form.flex-80(
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          )
        .form-inline.filter-item.form-label.layout-row
            el-form-item.flex-33.layout-row(label="附件名:" prop="fjm")
              el-input(v-model="ruleForm.fjm" clearable placeholder="请输入附件名")
            el-form-item.flex-33.layout-row(label="文件格式:"  prop="wjgs")
              el-select(v-model="ruleForm.wjgs" placeholder="请选择文件格式" clearable)
                    el-option(v-for="item in wjgsOptions" :key="item.name" :label="item.name" :value="item.value")
            el-form-item.flex-33.layout-row(label="上传用户:" prop="scyh")
              el-input(v-model="ruleForm.scyh" clearable placeholder="请输入上传用户")
        .form-inline.filter-item.form-label.layout-row
            el-form-item.flex-33.layout-row(label="文件大小:" required)
              .layout-row.flex
                el-form-item(prop="wjdxStart")
                  el-input(v-model="ruleForm.wjdxStart" clearable placeholder="请输入")
                    template(slot="append") M
                p —
                el-form-item(prop="wjdxEnd")
                  el-input(v-model="ruleForm.wjdxEnd" clearable placeholder="请输入")
                    template(slot="append") M
            el-form-item.flex-33.layout-row(label="上传时间:" required)
              .layout-row.flex
                el-form-item(prop="startTime")
                    el-date-picker(type="date" placeholder="开始时间" v-model="ruleForm.startTime" )
                p —
                el-form-item(prop="endTime")
                    el-date-picker(type="date" placeholder="结束时间" v-model="ruleForm.endTime" )
            .flex-33
        .layout-row
            el-button.filter-item(type="primary" icon="el-icon-upload" ) 上传附件
            el-button.filter-item( type="danger" icon="el-icon-delete" :disabled="deleteDisable") 批量删除
      .search-btn-group.search-btn
        el-button.filter-item(type="primary"
                    icon="el-icon-search"
                    @click="submitForm('ruleForm')") 搜索
        el-button.filter-item(type="warning"
                    icon="el-icon-refresh"
                    @click="resetForm('ruleForm')") 重置
    el-table.flex.table-wrap(v-loading="listLoading"
            :data="list"
            border
            fit
            height="300"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange")
        el-table-column(type="selection" width="55"  align="center")
        el-table-column(label="附件名" fixed="left" align="center" width="180" prop="fjm")
        el-table-column(label="文件大小" align="center"  prop="wjdx")
        el-table-column(label="文件位置" align="center"  prop="wjwz")
        el-table-column(label="文件格式" align="center"  prop="wjgs")
        el-table-column(label="是否引用" align="center"  prop="sfyy")
        el-table-column(label="上传用户" align="center"  prop="scyh")
        el-table-column(label="上传时间" align="center"  prop="upTime")
        el-table-column(fixed="right" width="180" label="操作" align="center" class-name="small-padding fixed-width")
            template(slot-scope="scope")
                .btn-group
                el-button(size="mini" type="danger" icon="el-icon-delete" title="删除" @click="deleteData(scope.row)")
                el-button(size="mini" type="success" icon="el-icon-tickets" title="详情" @click="showDetails(scope.row)")
    pagination.flex-15(:total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList")
  el-dialog(title='详情', :visible.sync='dialogVisible', width='30%')
    span 这是详情
    span.dialog-footer(slot='footer')
      el-button(@click='dialogVisible = false') 取 消
      el-button(type='primary', @click='dialogVisible = false') 确 定
</template>

<script>
import { fetchList } from '@/api/attachment'
import Pagination from '@/components/Pagination'
export default {
  name: 'Attachment',
  components: { Pagination },
  data() {
    return {
      total: 0,
      list: [],
      delIds: [],
      listLoading: false,
      deleteDisable: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      ruleForm: {
        fjm: '', // 附件名
        wjgs: '', // 文件格式
        scyh: '', // 上传用户
        wjdxStart: '', // 文件大小从xx开始
        wjdxEnd: '', // 文件大小到xx
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      rules: {
        fjm: [{ required: true, message: '请输入附件名', trigger: 'blur' }],
        wjgs: [
          { required: true, message: '请选择文件格式', trigger: 'change' }
        ],
        scyh: [{ required: true, message: '请输入上传用户', trigger: 'blur' }],
        wjdxStart: [{ required: true, message: '请输入', trigger: 'blur' }],
        wjdxEnd: [{ required: true, message: '请输入', trigger: 'blur' }],
        startTime: [
          {
            type: 'date',
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            type: 'date',
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ]
      },
      wjgsOptions: [
        { name: '.txt', value: '.txt' },
        { name: '.doc', value: '.doc' },
        { name: '.xlsx ', value: '.xlsx' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询表单
    submitForm(formName) {
      console.log(this.$day(this.ruleForm.startTime).format('YYYY-MM-DD'))

      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
    // 详情
    showDetails(row) {
      console.log(row)
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ 用于有scoped的style中覆盖 ui样式
.form-inline {
  display: flex;
  padding-right: 40px;
  /deep/ .el-form-item {
    flex: 1;
    .el-select {
      width: 100%;
    }
  }
}
.btn-group {
  display: flex;
  justify-content: center;
}
.form-item-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  &:first-child {
    border-top: none;
    margin-bottom: 10px;
    padding-top: 0;
  }
}

/deep/ .el-dialog {
  max-height: 85%;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}
.label{
  position: absolute;
  right:-15px;
  top:8px;
}
</style>
