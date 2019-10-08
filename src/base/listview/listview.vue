<template>
  <scroll class="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    v-on:scroll="scroll"
    ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
        class="item"
        :class="{'current': currentIndex === index}"
        :data-index="index"
        :key="item">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import { constants } from 'crypto';

let ANCHOR_HEIGHT = 18 // 侧边栏每一个字母元素的高度
export default {
  created() {
    // 不写在data里面，因为不用监听
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3 // 监听实时滚动
    this.listHeight = [] /// 每一个listGroup的高度形成的数组
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index') // data-index属性的值
      let firstTouch = e.touches[0] // 触摸时的位置
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 触摸移动过程中偏移了几个元素，向下取整
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta // parseInt解析字符串，返回整数
      this._scrollTo(anchorIndex)
    },
    //监听滚动事件，获取y轴的实时位置
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 点击上下两块空白时不反应
      if (!index && index !== 0) {
        return
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 参数0表示滚动没有缓动函数
    },
    //计算每个group的高度
    _calculateHeight() {
      this.listHeight = []
      let height = 0 // 没滚动时，pos.y = 0
      this.listHeight.push(height)
      for (let i = 0; i < this.$refs.listGroup.length; i++) {
        let item = this.$refs.listGroup[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    //传给listview的数据变化时计算
    data() {
      //数据的变化到dom的变化存在延时
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return // 返回，不再执行下面代码
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height_1 = listHeight[i]
        let height_2 = listHeight[i + 1]
        // 滚动到中间部分
        // 向上滚动时，pos.y为负值，所以用-newY
        if (-newY >= height_1 && -newY < height_2) {
          this.currentIndex = i
          return
        }
      }
      // 滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2 // listHeight的个数比元素个数多一个
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
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
</style>
