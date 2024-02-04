import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSongDetail, getSongLyric } from '../service/player'
import { ILyric, parseLyric } from '@/utils/parse-lyric'
import { IRootState } from '@/store'

// 点击歌曲的播放
export const fetchCurrentSongAction = createAsyncThunk<
  void,
  number,
  { state: IRootState }
>('currentSong', (id: number, { dispatch, getState }) => {
  // 当前播放列表
  const playSongList = getState().player.playSongList
  // 当前点击播放的歌曲是否在播放列表中存在
  const findIndex = playSongList.findIndex((item) => item.id == id)
  // 如果不存在：请求播放歌曲的数据 => 更新当前歌曲、播放列表、播放歌曲的索引、获取当前歌曲的歌词
  // 如果存在：更新当前歌曲、播放歌曲的索引、获取当前歌曲的歌词
  if (findIndex == -1) {
    getSongDetail(id).then((res) => {
      if (!res.songs.length) return
      const song = res.songs[0]
      const newPlaySongList = [...playSongList]
      newPlaySongList.push(song)
      dispatch(changeCurrentSongAction(song))
      dispatch(changePlaySongListAction(newPlaySongList))
      dispatch(changePlaySongIndexAction(newPlaySongList.length - 1))
    })
  } else {
    const song = playSongList[findIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changePlaySongIndexAction(findIndex))
  }

  // 获取歌词
  getSongLyric(id).then((res) => {
    const lyric = res.lrc.lyric
    dispatch(changeLyricsAction(parseLyric(lyric)))
  })
})

// 切换音乐 => 更新当前歌曲、播放歌曲的索引、获取当前歌曲的歌词
export const changeMusicAction = createAsyncThunk<
  void,
  boolean,
  { state: IRootState }
>('changeMusic', (isNext, { dispatch, getState }) => {
  const player = getState().player
  const playMode = player.playMode
  const songIndex = player.playSongIndex
  const songList = player.playSongList
  // 修改歌曲索引
  let newIndex = songIndex
  // 随机播放
  if (playMode === 1) {
    newIndex = Math.floor(Math.random() * songList.length)
  } else {
    newIndex = isNext ? songIndex + 1 : songIndex - 1
    if (newIndex > songList.length - 1) newIndex = 0
    if (newIndex < 0) newIndex = songList.length - 1
  }

  const song = songList[newIndex]
  dispatch(changeCurrentSongAction(song))
  dispatch(changePlaySongIndexAction(newIndex))
  getSongLyric(song.id).then((res) => {
    const lyric = res.lrc.lyric
    dispatch(changeLyricsAction(parseLyric(lyric)))
  })
})

interface IPlayerState {
  currentSong: any
  lyrics: ILyric[]
  lyricIndex: number
  playSongList: any[]
  playSongIndex: number
  playMode: number
}

const initialState: IPlayerState = {
  currentSong: {},
  lyrics: [],
  lyricIndex: -1,
  playSongList: [],
  playSongIndex: -1,
  playMode: 0 // 0:顺序 1:随机 2:单曲
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeCurrentSongAction(state, { payload }) {
      state.currentSong = payload
    },
    changeLyricsAction(state, { payload }) {
      state.lyrics = payload
    },
    changeLyricIndexAction(state, { payload }) {
      state.lyricIndex = payload
    },
    changePlaySongListAction(state, { payload }) {
      state.playSongList = payload
    },
    changePlaySongIndexAction(state, { payload }) {
      state.playSongIndex = payload
    },
    changePlayModeAction(state, { payload }) {
      state.playMode = payload
    }
  }
})
export const {
  changeCurrentSongAction,
  changeLyricsAction,
  changeLyricIndexAction,
  changePlaySongListAction,
  changePlaySongIndexAction,
  changePlayModeAction
} = playerSlice.actions
export default playerSlice.reducer
