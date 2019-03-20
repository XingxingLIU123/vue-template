<template lang="pug">
	transition(name="el-zoom-in-right")
		.slide-window(v-if="visible")
			.head
				p(v-if="showTitle" @click="showTitle = !showTitle") {{data.label}}
				el-input(v-else v-model='data.label' @blur="showTitle=true" placeholder='请输入标题')
			.body
				slot(name="body")
			.bottom
				el-button(@click="emitFormData") 确定
				el-button(@click="close") 取消
</template>

<script>
export default {
  name: 'WindSlide',
  props: {
    visible: {
      type: Boolean,
      default() {
        return true
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showTitle: true
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    emitFormData() {
      this.$emit('getFormData')
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
	.slide-window{
		position: absolute;
		background:rgba(0,0,0,.5);
		z-index: 2;
		top: 0;
		right: 0;
		height: 100%;
		width: 550px;
	}
</style>

