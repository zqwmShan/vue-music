<!-- 推荐页组件 -->
<template>
  <div class="recommend" >
    <!-- scroll，当请求到 recommends 时才渲染 -->
    <scroll v-if="discList.length" class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- 轮播图，当请求到 recommends 时才渲染 -->
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="loadImage" />
                <!-- needsclick better-scroll带的 解决click冲突问题 -->
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单推荐列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  // import {playlistMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  // import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        recommends : [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 获取轮播图数据
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERR_OK){
           this.recommends =  res.data.slider
          }
        })
      },
      // 获取歌单列表数据
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code ===  ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      // 当首次获取到图片时，Better-scroll 重新计算
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
