import { playMode } from 'common/js/config'

const state = {
  singer: {},

  playing: false, //播放状态，开始还是暂停
  fullScreen: false,  //是否全屏
  playList: [],  //播放列表
  sequenceList: [],  //顺序播放列表
  mode: playMode.sequence,
  currentIndex: -1, //当前播放的歌曲
  disc: {},
  topList: []
}
export default state