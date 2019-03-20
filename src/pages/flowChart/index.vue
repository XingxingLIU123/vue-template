<template lang="pug">
  .dagre-graph-container
    flow-chart(:nodes="nodes" :edges="edges")
</template>
<script>
/**
 * 流程图
 */
import flowChart from '@/components/flowChart'
export default {
  name: 'FlowDiagram',
  components: {
    flowChart
  },
  data() {
    return {
      nodes: [],
      edges: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.nodes = [
        {
          id: 'e1',
          state: '',
          value: {
            label: '发起人',
            operator: 'BashOperator'
          },
          data: {
            a: 1,
            type: 'root'
          }
        },
        {
          id: 'e2',
          state: 'success',
          value: {
            label: '分支一',
            operator: 'BranchPythonMapOperator'
          },
          data: {
            type: 'one'
          }
        },
        {
          id: 'e3',
          state: 'success',
          type: '',
          value: {
            label: '分支二',
            operator: 'BranchPythonMapOperator'
          },
          data: {
            type: 'one'
          }
        },
        {
          id: 'e4',
          state: 'queued',
          value: {
            label: '节点3',
            operator: 'BashOperator'
          },
          data: {
            type: 'two'
          }
        },
        {
          id: 'e5',
          state: 'failed',
          value: {
            label: '节点4',
            operator: 'BashOperator'
          },
          data: {
            type: 'two'
          }
        },
        {
          id: 'e6',
          state: 'upstream_failed',
          value: {
            label: '结束',
            operator: 'JoinOperator'
          },
          data: {
            type: 'finish'
          }
        }
      ]
      this.edges = [
        {
          from: 'e1',
          to: 'e2'
        },
        {
          from: 'e1',
          to: 'e3'
        },
        {
          from: 'e2',
          to: 'e4',
          label: '条件1'
        },
        {
          from: 'e3',
          to: 'e5',
          label: '条件2'
        },
        {
          from: 'e4',
          to: 'e6'
        },
        {
          from: 'e5',
          to: 'e6'
        }
      ]
    }
  }
}
</script>
<style lang='scss' scoped>
.dagre-graph-container {
    width: 100%;
    height: 800px;
}
</style>
