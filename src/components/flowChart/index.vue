<template lang="pug">
  .dagre-graph-container(:id="containerId")
    .zoom-div
      button(v-for="item in directions" :key="item.prop" @click="direction = item.prop") {{item.label}}
      button.zoom(@click="zoomCtrl('in')") 缩小
      button(@click="zoomCtrl('out')") 扩大
    .zoom-div
      button(@click="add") 新增
      button(@click="remove") 删除
    svg.dagre
      g.container
    .d3-menus(:style="menuStyle")
      ul
        li(v-for="(menu,i) in menus" :key="i") {{ menu.label }}
    win-slide(:visible.sync="slideVisible" :data="nodeData" @getFormData="getFormData")
      root-body(slot='body' v-if="nodeData.data.type === 'root'" ref="body")
      one-body(slot='body' v-else-if="nodeData.data.type === 'one'" ref="body")

</template>
<script>
import winSlide from '@/components/SlideWindow'
import rootBody from '@/components/flowChart/root'
import oneBody from '@/components/flowChart/one'
import * as d3 from 'd3'
import DagreD3 from 'dagre-d3'
let container = null
export default {
  name: 'FlowChart',
  components: {
    winSlide,
    rootBody,
    oneBody
  },
  props: {
    nodes: {
      type: Array,
      default: function() {
        return []
      }
    },
    edges: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      id: '',
      renderer: null,
      graph: null,
      direction: 'TB',
      directions: [
        {
          prop: 'LR',
          label: '从左至右'
        },
        {
          prop: 'RL',
          label: '从右至左'
        },
        {
          prop: 'TB',
          label: '从上至下'
        },
        {
          prop: 'BT',
          label: '从下至上'
        }
      ],
      zoom: null,
      containerId: '',
      width: 0,
      height: 0,
      slideVisible: false,
      nodeData: {
        data: ''
      },
      // 菜单选项
      menus: [
        {
          label: '审批人',
          icon: 'xxx',
          key: 'spr'
        },
        {
          label: '抄送人',
          icon: 'xxx',
          key: 'csr'
        },
        {
          label: '条件分支',
          icon: 'xxx',
          key: 'spr'
        }
      ],
      menuStyle: {
        left: '',
        top: ''
      }
    }
  },
  watch: {
    nodes() {
      this.strokeNodes()
    },
    edges() {
      this.strokeEdges()
    },
    direction() {
      this.graph.setGraph({
        rankdir: this.direction
      })
      this.renderer(container, this.graph)
    }
  },
  created() {
    this.containerId = this.uuid()
    this.graph = new DagreD3.graphlib.Graph()
      .setGraph({
        rankdir: this.direction
      })
      .setDefaultEdgeLabel(function() {
        return {}
      })
  },
  mounted() {
    this.width = document.getElementById(this.containerId).clientWidth
    this.height = document.getElementById(this.containerId).clientHeight
    // eslint-disable-next-line
    const el = this.$el.querySelector("svg.dagre");
    el.oncontextmenu = e => {
      e.preventDefault()
    }
    /* eslint-disable */

    this.renderer = new DagreD3.render();
    /* eslint-enable */

    const svg = d3
      .select(this.$el)
      .select('svg.dagre')
      .attr('width', this.width)
      .attr('height', this.height)
    container = svg.select('g.container')
    // transform
    const transform = d3.zoomIdentity
      .translate(this.width / 3, this.height / 6)
      .scale(1)

    this.zoom = d3
      .zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', () => {
        container.attr('transform', d3.event.transform)
      })
    svg.call(this.zoom)
    svg
      .transition()
      .duration(750)
      .call(this.zoom.transform, transform)

    this.strokeNodes()
    this.strokeEdges()
  },
  methods: {
    uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      }
      return (
        s4() +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        s4() +
        s4()
      )
    },
    zoomCtrl(symbal) {
      const scale = symbal === 'out' ? 1.1 : 0.8
      const svg = d3.select(this.$el).select('svg.dagre')
      this.zoom.scaleBy(svg, scale)
    },
    /**
     * @description 画节点
     */
    strokeNodes() {
      // 获取之前的nodes缓存并清除
      const nodes = this.graph.nodes()
      if (nodes.length) {
        nodes.forEach(item => {
          this.graph.removeNode(item)
        })
      }

      this.nodes.forEach(item => {
        const state = item.state ? item.state : 'no-status'
        let shape = 'rect'
        if (item.value.operator === 'BranchPythonMapOperator') {
          shape = 'ellipse'
        } else if (item.value.operator === 'JoinOperator') {
          shape = 'circle'
        }

        this.graph.setNode(item.id, {
          label: item.value.label, // 可以是HTML
          shape: shape,
          data: item.data,
          class: item.value.operator + ' dagre ' + state
        })
      })
      this.renderer(container, this.graph)
      // 添加事件
      this.$nextTick(() => {
        d3.select(this.$el)
          .selectAll('.nodes>g')
          .on('click', id => {
            event.stopPropagation()
            const data = this.graph._nodes[id]
            this.nodeData = data
            this.slideVisible = true
          })
          .on('contextmenu', id => {
            // const data = this.graph._nodes[id]
            this.menuStyle = {
              display: 'block',
              left: `${d3.event.x - 140}px`,
              top: `${d3.event.y - 110}px`
            }
          })
        const svg = this.$el.querySelector('svg.dagre')
        svg.onclick = e => {
          this.slideVisible = false
          this.menuStyle.display = 'none'
        }
      })
    },
    /**
     * @description 画线
     */
    strokeEdges() {
      // 一个脚本节点时：不渲染eage
      if (this.nodes.length > 1) {
        this.edges.forEach(item => {
          if (item.label) {
            this.graph.setEdge(item.from, item.to, { label: item.label })
          } else {
            this.graph.setEdge(item.from, item.to)
          }
        })
        this.renderer(container, this.graph)
      }
    },
    /** *
     * @description 弹窗按钮
     */
    sure() {},
    add() {},
    remove() {},
    /**
     * @description 获取子组件上传的数据
     */
    getFormData() {
      const data = this.$refs.body.getData()
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.dagre-graph-container {
/************ 图表变量 ***************/
  $fail: #f77d6b;
  $success: #61b2e4;
  $running: #87d86f;
  $skipped: #faec91;
  $queued: #43e3ed;
  $retry: #f8b96c;
  $no-status: #fff;
  $upstream_failed: rgb(163, 108, 108);
/**************** dagre 节点图************************/
  /deep/.edgePath path {
    stroke: #333;
    fill: #333;
    stroke-width: 1.5px;
  }

  /deep/g.node.dagre {
    tspan {
      fill: #fff;
      cursor: pointer;
    }
    &.no-status {
      rect {
        stroke: #333;
        fill: #fff;
      }
      ellipse {
        stroke: #333;
        fill: #fff;
      }
      circle {
        stroke: #333;
        fill: #fff;
      }
      tspan {
        fill: #333;
      }
    }
    &.success {
      rect {
        stroke: #fff;
        fill: $success;
      }
      ellipse {
        stroke: #fff;
        fill: $success;
      }
      circle {
        stroke: #fff;
        fill: $success;
      }
    }
    &.failed {
      rect {
        stroke: #fff;
        fill: $fail;
      }
      ellipse {
        stroke: #fff;
        fill: $fail;
      }
      circle {
        stroke: #fff;
        fill: $fail;
      }
    }
    &.upstream_failed {
      rect {
        stroke: #fff;
        fill: $upstream_failed;
      }
      ellipse {
        stroke: #fff;
        fill: $upstream_failed;
      }
      circle {
        stroke: #fff;
        fill: $upstream_failed;
      }
    }
    &.running {
      rect {
        stroke: #fff;
        fill: $running;
      }
      ellipse {
        stroke: #fff;
        fill: $running;
      }
      circle {
        stroke: #fff;
        fill: $running;
      }
    }
    &.skipped {
      rect {
        stroke: #fff;
        fill: $skipped;
      }
      ellipse {
        stroke: #fff;
        fill: $skipped;
      }
      circle {
        stroke: #fff;
        fill: $skipped;
      }
    }
    &.queued {
      rect {
        stroke: #fff;
        fill: $queued;
      }
      ellipse {
        stroke: #fff;
        fill: $queued;
      }
      circle {
        stroke: #fff;
        fill: $queued;
      }
    }
    &.BashOperator {
      &:hover {
        & > rect {
          cursor: pointer;
          fill: #7cc9fa;
        }
      }
    }
    &.BranchPythonMapOperator {
      &:hover {
        & > ellipse {
          cursor: pointer;
          fill: #c52bd3;
        }
      }
    }
    &.JoinOperator {
      &:hover {
        & > circle {
          cursor: pointer;
          fill: #0beb8d;
        }
      }
    }
  }
  .zoom {
    margin-left: 40px;
  }
  .d3-menus{
    position: absolute;
    display: none;
    background: red;
    padding:10px;
    li{
      padding: 10px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>

