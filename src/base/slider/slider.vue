<!-- better-scroll 轮播图组件 -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      // 是否循环播放
      loop: {
        type: Boolean,
        default: true
      },
      //是否自动播放
      autoPlay: {
        type: Boolean,
        default: true
      },
      //轮播延时
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }

      }, 20)  //保证dom渲染完

      // 当窗口尺寸改变时，重新计算轮播宽度
      window.addEventListener('resize', () => {
        if(!this.slider) {  //还未初始化的时候
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      // 轮播图(sliderGroup)宽度
      _setSliderWidth(isResize) {
        //拿到传过来的图片
        this.children = this.$refs.sliderGroup.children

        // 拿到父元素（slider）宽度
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth

        // 动态添加 class、width
        for (let i=0; i<this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth+ 'px'
          width += sliderWidth
        }

        if(this.loop && !isResize) {
          width += 2 * sliderWidth  //只有第一次要加2width
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化轮播点
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      //初始化轮播图
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,   //横向滚动
          scrollY: false,  //纵向滚动
          momentum: false, //开启动画
          snap: true,
          snapLoop: this.loop,  //循环轮播
          snapThreshold: 0.3,   //可滚动到下一个的阈值
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX  //表示横轴方向的页面数
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          // 重置自动轮播定时器
          if(this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      // 自动播放
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if(this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)  //可以滚动到指定的页面
        }, this.interval)
      }
    },
    destroyed() {
      // 良好的习惯：销毁定时器
      clearTimeout(this.timer)
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
