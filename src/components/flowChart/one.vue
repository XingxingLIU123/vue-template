<template lang="pug">
.node-root
    el-tabs(v-model='activeName', @tab-click='handleClick')
        el-tab-pane(label='设置审批人', name='approver')
            el-radio-group(v-model='radio2')
                el-radio(:label='item.label' v-for="(item,i) in radioOption" :key="i") {{ item.name }}
            p 下面操作
        el-tab-pane(label='表单操作权限', name='table')

</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 审批人数据
      radioOption: [
        {
          label: 1,
          name: '指定成员'
        },
        {
          label: 2,
          name: '主管'
        },
        {
          label: 3,
          name: '角色'
        },
        {
          label: 4,
          name: '发起人自选'
        },
        {
          label: 5,
          name: '发起人自己'
        }
      ],
      radio2: '',
      activeName: 'approver'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 获取组件数据给父组件
     */
    getData() {
      return this.radio2
    },
    handleClick(data) {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

