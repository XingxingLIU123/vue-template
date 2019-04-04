<template lang="pug">
.container(style="position:relative;")
    .wrapper
</template>

<script>
export default {
  name: 'LogPie',
  props: {
    option: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    selfOption() {
      return Object.assign({}, this.option)
    }
  },
  watch: {
    selfOption: {
      handler: function(val) {
        if (!this.chart) return
        this.chart.setOption(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.chart = this.$ec.init(this.$el.querySelector('.wrapper'))
    this.chart.setOption(this.selfOption)
    console.log(this.$ec)
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  width: 100%;
  height: 100%;
}
</style>
