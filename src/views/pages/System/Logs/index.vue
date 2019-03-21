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
                el-form-item.flex-33.layout-row(label="操作人：" prop="operation")
                    el-select(v-model="ruleForm.operation" placeholder="请选择操作人" clearable)
                        el-option( v-for="item in operationOptions" :key="item.name" :label="item.name" :value="item.value")
                el-form-item.flex-33.layout-row(label="日志类型："  prop="logtype")
                    el-select(v-model="ruleForm.logtype" placeholder="请选择日志类型" clearable)
                        el-option(v-for="item in logtypeOptions" :key="item.name" :label="item.name" :value="item.value")
                el-form-item.flex-33.layout-row(label="操作模块：" prop="module")
                  el-select(v-model="ruleForm.module" placeholder="请选择操作模块" clearable)
                      el-option(v-for="item in moduleOptions" :key="item.name" :label="item.name" :value="item.value")
            .form-inline.filter-item.form-label.layout-row
                el-form-item.flex-33.layout-row(label="操作IP：" prop="ip")
                    el-select(v-model="ruleForm.ip" placeholder="请选择操作IP" clearable)
                        el-option(v-for="item in ipOptions" :key="item.name" :label="item.name" :value="item.value")
                el-form-item.layout-row.flex-33(label="操作时间：" required)
                  .layout-row.flex
                      el-form-item.flex(prop="startTime")
                        el-date-picker(type="date" placeholder="开始时间" v-model="ruleForm.startTime")
                      p —
                      el-form-item.flex(prop="endTime")
                        el-date-picker(type="date" placeholder="结束时间" v-model="ruleForm.endTime")
                .flex-33
        .search-btn-group.search-btn
          el-button.filter-item(type="primary"
                      icon="el-icon-search"
                      @click="submitForm('ruleForm')") 查询
          el-button.filter-item(
                      type="warning"
                      icon="el-icon-refresh"
                      @click="resetForm('ruleForm')") 重置
    el-table.table-wrap(v-loading="listLoading"
            :data="list"
            border
            fit
            height="600"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange")
        el-table-column(type="selection" width="55"  align="center")
        el-table-column(label="操作人" fixed="left" align="center" width="180" prop="czr")
        el-table-column(label="操作机器IP" align="center"  prop="ip")
        el-table-column(label="操作时间" align="center"  prop="czsj")
        el-table-column(label="操作模块" align="center"  prop="czmk")
        el-table-column(label="操作功能" align="center"  prop="czgn")
        el-table-column(label="创建时间" align="center"  prop="makeTime")
        el-table-column(label="更新时间" align="center"  prop="updateTime")
        el-table-column(fixed="right" width="180" label="操作" align="center" class-name="small-padding fixed-width")
            template(slot-scope="scope")
                .btn-group
                el-button(size="mini" type="danger" title="删除" icon="el-icon-delete" @click="deleteData(scope.row)")
                el-button(size="mini" type="success" title="详情" icon="el-icon-tickets" @click="showDetails(scope.row)")
    pagination(:total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList")
    log-pie.pie-height(
      :option="pieOption"
      )
    el-dialog(title='详情', :visible.sync='dialogVisible', width='30%')
      span 这是详情
      span.dialog-footer(slot='footer')
        el-button(@click='dialogVisible = false') 取 消
        el-button(type='primary', @click='dialogVisible = false') 确 定
</template>

<script>
import { fetchList } from '@/api/log'
import Pagination from '@/components/Pagination'
import LogPie from './logPie' // 饼图
export default {
  name: 'Log',
  components: { Pagination, LogPie },
  data() {
    return {
      list: [],
      dialogVisible: false,
      pieOption: {
        title: {
          text: '',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'top',
          data: [
            'rose1',
            'rose2',
            'rose3',
            'rose4',
            'rose5',
            'rose6',
            'rose7',
            'rose8'
          ]
        },
        calculable: true,
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            data: [
              { value: 10, name: 'rose1' },
              { value: 5, name: 'rose2' },
              { value: 15, name: 'rose3' },
              { value: 25, name: 'rose4' },
              { value: 20, name: 'rose5' },
              { value: 35, name: 'rose6' },
              { value: 30, name: 'rose7' },
              { value: 40, name: 'rose8' }
            ]
          }
        ]
      },
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      ruleForm: {
        operation: '', // 操作人
        logtype: '', // 日志类型
        module: '', // 操作模块
        ip: '', // 操作ip
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      operationOptions: [
        { name: '负责人1', value: '负责人1' },
        { name: '负责人2', value: '负责人2' }
      ],
      logtypeOptions: [
        { name: '错误日志', value: '错误日志' },
        { name: '操作日志', value: '操作日志' }
      ],
      moduleOptions: [
        { name: '模块1', value: '模块1' },
        { name: '模块2', value: '模块2' }
      ],
      ipOptions: [{ name: 'ip1', value: 'ip1' }, { name: 'ip2', value: 'ip2' }],
      rules: {
        operation: [
          { required: true, message: '请选择操作人', trigger: 'change' }
        ],
        logtype: [
          { required: true, message: '请选择日志类型', trigger: 'change' }
        ],
        module: [
          { required: true, message: '请选择操作模块', trigger: 'change' }
        ],
        ip: [{ required: true, message: '请选择IP', trigger: 'change' }],
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
      }
    }
  },
  created() {
    this.getList()
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
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
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
.app-container{
  /deep/ .el-button--mini{
    width: 30px;
    padding: 6px 7px;
    i{
      font-size: 14px
    }
  }
}
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
.pie-height{
  height:400px;
}
</style>
