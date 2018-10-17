<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {  //better-scroll的属性
        type: Number,
        default: 1
      },
      click: {  //better-scroll的属性
        type: Boolean,
        default: true
      },
      // 传入的数据
      data: {
        type: Array,
        default: null
      },
      // 是否监听滚动位置
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否开启上拉刷新
      pullup: {
        type: Boolean,
        default: false
      },
      // 滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 延迟刷新
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    watch: {
      data: function() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
