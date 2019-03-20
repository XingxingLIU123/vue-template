<template lang="pug">
.node-root
    el-tabs(v-model='activeName')
      el-tab-pane(label='设置发起人', name='initiator')
        p 谁可以发起这个审批
        el-tree(:data='treeData', node-key='id', :props='defaultProps')
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
      activeName: 'initiator',
      treeData: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
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
  watch: {},
  created() {
    console.log(this)
  },
  mounted() {},
  methods: {
    /**
     * @description 获取组件参数给父组件
     */
    getData() {
      return this.treeData
    },
    handleClick(data) {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

