<template lang="pug">
el-dialog.modify-dialog(
  :visible="show"
  :width="width"
  title="编辑"
  @close="close"
  @open="open")
  el-form(ref="dialogForm" :model="dialogForm" :label-width="formLabelWidth")
    el-form-item(label="权限名称" prop="permission")
      el-input(
        v-model="dialogForm.permission"
        type="text"
        class="form-input"
        auto-complete="off"
        placeholder="请输入")
    el-form-item(label="权限id" prop="permissionId")
      el-input(
        v-model="dialogForm.permissionId"
        :disabled="true"
        type="text"
        auto-complete="off"
        placeholder="请输入"
        class="form-input")
    el-form-item(label="创建时间" prop="createdTime")
      el-input(
        v-model="dialogForm.createdTime"
        :disabled="true"
        type="text"
        auto-complete="off"
        placeholder="请输入"
        class="form-input")
    el-form-item(label="更新时间" prop="modifyTime")
      el-input(
        v-model="dialogForm.modifyTime"
        :disabled="true"
        type="text"
        auto-complete="off"
        placeholder="请输入"
        class="form-input")
    el-form-item(label="关联角色" prop="modifyTime")
      el-checkbox-group(v-model="dialogForm.roles")
        el-checkbox(
          v-for="item in checkLists"
          :key="item.name"
          :label="item.name")
  .dialog-footer(slot="footer")
    el-button(@click="close") 取 消
    el-button(type="primary" @click="modify") 确 定
</template>

<script>
import { roleList, modifyRoleList } from '@/api/menu'
export default {
  name: 'ModifyDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      width: '40%',
      dialogForm: {
        permission: '',
        permissionId: '',
        createdTime: '',
        modifyTime: '',
        roles: []
      },
      options: [
        {}
      ],
      checkLists: []
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$refs['dialogForm'].resetFields()
      this.$emit('onClose')
    },
    // 确定修改
    modify() {
      const params = {
        name: this.dialogForm.permission,
        roles: this.dialogForm.roles
      }
      modifyRoleList(params).then(() => {
        this.$emit('onClose')
        this.$message.success('修改成功')
      })
    },
    // 显示弹窗
    open() {
      this.dialogForm = Object.assign(this.dialogForm, this.form)
      this.getRoles()
    },
    // 获取角色数据
    getRoles() {
      // 传入自己的角色,获取可配置的角色
      // XXX: 每个角色可控制的角色应该可以在角色信息中获取,不需要再请求
      const role = this.$store.getters.roles[0]
      roleList(role).then(res => {
        console.log(res)
        this.dialogForm.roles = []
        res.data.map(item => {
          if (item.status === '1') {
            this.dialogForm.roles.push(item.name)
          }
        })
        this.checkLists = res.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.modify-dialog{
  .form-input{
    width: 64%;
  }
}
</style>
