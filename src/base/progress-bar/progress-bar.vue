<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- .prevent阻止触摸移动时的默认滚屏 -->
      <div class="progress-button-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-button"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX // 触碰时的初始位置
      this.touch.left = this.$refs.progress.clientWidth // 此时的进度
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 手指滑动的距离
      // 滑动过程中的进度(不能小于0或者大于进度条的长度)
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth ,Math.max(0, deltaX + this.touch.left))
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      // console.log(e)
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 当点击到按钮时，e.offsetX获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    },
    // 派发事件：进度改变
    _triggerPercent() {
      let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      let percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    // 设置此时的进度和按钮的位置
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent(newPercent) {
      // !this.touch.initiated确保不是在拖动过程中，否则拖动和歌曲播放两者都会引起进度改变
      if (newPercent > 0 && !this.touch.initiated) {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $color-theme
    .progress-button-wrapper
      position absolute
      top -13px
      left -8px
      height 30px
      width 30px
      .progress-button
        position relative
        top 7px
        left 7px
        height 16px
        width 16px
        border 3px solid $color-text
        box-sizing border-box
        border-radius 50%
        background $color-theme
</style>