<template lang="pug">
  el-dialog(
    :visible="show"
    :width="width"
    :title="title"
    class="dialog-warp"
    @close="close(dialogFormRef)"
    @open="open")
    el-form(
      :ref="dialogFormRef"
      :rules="rules"
      :model="formData"
      :label-width="formLabelWidth")
      el-form-item(
        v-for="item in items"
        :key='item.prop'
        :label="item.label"
        :prop="item.prop")
        el-input(
          v-if="item.input"
          v-model="formData[item.prop]"
          :disable="item.disabled"
          :size="item.size"
          :type="item.type"
          auto-complete="off"
          placeholder="请输入"
          class="form-input")
        el-date-picker(
          v-if="item.time"
          placeholder="请选择时间"
          :type="item.type"
          value-format="yyyy-MM-dd"
          v-model="formData[item.prop]")
        el-select(
          v-if="item.select"
          v-model="formData[item['prop']]"
          :disable="item.disabled"
          :size="item.size"
          @change="change"
          class="form-input")
          el-option(
            v-for="list in item.options"
            :key="list.value"
            :label="list.label"
            :value="list.value")
        el-checkbox-group(
          v-if="item.checkbox"
          v-model="formData[item.prop]")
          el-checkbox(
            v-for="list in item.options"
            :key="list.value"
            :label="list.label")
        el-radio-group(v-if="item.radio" v-model="formData[item.prop]" @change="change")
          el-radio(v-for="list in item.options"
          :key="list.label"
          :label="list.value") {{list.label}}
        .dialog-tree-warp
          el-tree(
            v-if="item.tree"
            v-model="formData[item.prop]"
            class="form-input"
            :data="item.options"
            show-checkbox
            ref="refTree"
            node-key="id"
            :default-checked-keys="formData[item.prop]"
            :expand-on-click-node="false")
            span.custom-tree-node(slot-scope="{ node, data }")
              i.iconfont.iconwenjianjia(v-if="node.icon === 'module'" style="margin-right:5px")
              i.iconfont.iconzidian(v-else="node.icon === 'function'" style="margin-right:5px")
              span {{ node.label }}
    .dialog-footer(
      slot="footer")
      el-button(@click="close(dialogFormRef)") 取消
      el-button(type="primary" @click="modify(dialogFormRef)") 确定
</template>
<script>
export default {
  name: 'ModifyDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    width: {
      type: String,
      default: '40%'
    },
    dialogFormRef: {
      type: String,
      default: 'refForm'
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    formLabelWidth: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    // console.log(this.formData)
  },
  methods: {
    close(ref) {
      this.$refs[ref].resetFields()
      this.$emit('onClose')
    },
    modify(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          // TODO:如果有树控件 获取并返回被勾选的树的数据
          if (this.$refs.refTree) {
            var atr = this.items.find(item => {
              return item.tree === true
            })
            var list = this.$refs['refTree'][0].getCheckedKeys()
            this.formData[atr.prop] = list
          }
          this.$emit('onConfirm', this.formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open() {

    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-input{
  width: 70%;
}
.dialog-warp{
  /deep/ .el-dialog{
    max-height: 900px;
    overflow-y: auto;
    /deep/ .el-form{
      .dialog-tree-warp{
        /deep/ .el-tree{
          min-height: 120px;
          max-height: 200px;
          overflow-y: auto;
          // >.el-tree-node{
          //   min-width:100%;
          //   display: inline-block;
          // }
        }

      }
    }
  }
}
</style>
