<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!-- 左侧歌手列表 -->
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧字母列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 快速入口排列数组
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      //滚动到对应list 固定标题 做个判断以确保data有数据
      fixedTitle() {
        if ( this.scrollY > 0 ){
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created() {
      this.touch = {},  //不需要观测touch的变化 所以不写在data里
      this.listenScroll = true,
      this.listHeight = [],
      this.probeType = 3
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        //当滚动到顶部，newY大于0
        if( newY > 0 ) {
          this.currentIndex = 0
          return
        }
        //当滚动到中间部分 newY为负值
        for (let i=0; i<listHeight.length-1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          if( -newY >= height1 && -newY < height2 ) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        //当滚动到底部
        this.currentIndex = listHeight.length - 2   //由于listHeight开始多了一个0
      },
      diff(newVal) {
        //两个title有重叠的时候 即newVal < TITLE_HEIGHT
        let fixedTop =  ( newVal > 0 && newVal < TITLE_HEIGHT ) ? newVal - TITLE_HEIGHT : 0
        if ( this.fixedTop === fixedTop ) {  //只有fixedTop不为0 即变化的时候才能执行下面的不然return
          return
        }
        //console.log(fixedTop)
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,$(fixedTop)px,0)`  //这里不太懂
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      // 点击右侧，左侧联动
      onShortcutTouchStart(e){
        let anchorIndex = getData(e.target, 'index')

        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex  //点击的当前索引

        this._scrollTo(anchorIndex)
      },
      // 滑动右侧，左侧联动，与左侧共享 touch 对象
      onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY

        // 两次 touch y轴偏移
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        //点击右侧上下空白处由于没有deta-index 所以index为null
        if ( !index && index!==0 ){
          return
        }
        //滑动右侧
        if ( index < 0 ){  //滑动到字母列表上面
          index = 0
        } else if ( index > this.listHeight.length - 2 ){  //滑动到字母列表下面
          index = this.listHeight.length - 2
        }

        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      //计算每一分类的list y轴偏移  写成数组 这样可知道左侧列表滚动到的listgroup的索引
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      Scroll,
      Loading
    }
  };

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
