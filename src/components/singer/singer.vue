<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  // import {mapMutations} from 'vuex'
  // import {playlistMixin} from 'common/js/mixin'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      // 获取歌手列表数据
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK){
           this.singers =  this._normalizeSinger(res.data.list)
           console.log(this.singers)
          }
        })
      },
      // 重组 res.data.list 数据
      _normalizeSinger(list) {
        // 热门歌手
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        // 填充歌手数据
        list.forEach((item, index) => {
          // 填充热门歌手数据
          if( index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }
          // 填充 a-z 字母
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          // 填充对应字母歌手数据
          map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
        })
        // 得到有序列表
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //升序
        ret.sort((a, b) => {  //charCodeAt(index)可返回指定位置的字符的 Unicode 编码
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        console.log(hot.concat(ret))
        return hot.concat(ret)
      }
    },
    components: {
      ListView
    }
  };

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
