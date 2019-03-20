<template>
  <el-dialog
    :visible.sync="show"
    :width="width"
    title="修改密码"
    @close="close">
    <el-form ref="passwordForm" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="form.password" type="password" auto-complete="off" placeholder="请输入原密码" class="form-input" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="form.pass" type="password" auto-complete="off" placeholder="请输入新密码" class="form-input" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="form.checkPass" type="password" auto-complete="off" placeholder="请再次输入新密码" class="form-input" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="modifyPassword">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { setUserInfo } from '@/api/login'
import md5 from 'js-md5'
export default {
  name: 'ModifyDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.passwordForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '90px',
      width: '40%',
      form: {
        password: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码应该大于6位', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码必须大于6位', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          // { type: 'date', required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    close() {
      this.$refs['passwordForm'].resetFields()
      this.$emit('onClose')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    modifyPassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.$store.dispatch('GetUserInfo').then((res) => {
            if (res.data.password === md5(this.form.password)) {
              // 发起请求
              setUserInfo(res.data.token, this.form.pass).then((res) => {
                if (res.status === 200) {
                  this.$message.success('密码修改成功')
                  this.close()
                } else {
                  this.$message.error('密码修改失败')
                }
              })
            } else {
              this.$message.error('原密码输入错误')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-input{
  width: 50%;
}
</style>
