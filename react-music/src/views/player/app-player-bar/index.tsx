import React, { memo, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BarControl,
  BarOperator,
  BarPlayerInfo,
  PlayerBarWrapper
} from './style'
import { Link } from 'react-router-dom'
import { Slider } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { formatTime, getImageSize } from '@/utils/format'
import { shallowEqual } from 'react-redux'
import { getSongUrl } from '@/utils/handle-player'
import {
  changeLyricIndexAction,
  changeMusicAction,
  changePlayModeAction
} from '../store/player'

interface IProps {
  children?: ReactNode
}

const AppPlayerBar: React.FC<IProps> = () => {
  const dispatch = useAppDispatch()
  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false)
  // 进度条 0-100
  const [progress, setProgress] = useState(0)
  // 歌曲总时长
  const [duration, setDuration] = useState(0)
  // 歌曲当前时长
  const [currentTime, setCurrentTime] = useState(0)
  // audio实例
  const audioRef = useRef<HTMLAudioElement>(null)

  // 获取当前歌曲，当前歌曲歌词，歌词索引，播放模式
  const { currentSong, lyrics, lyricIndex, playMode } = useAppSelector(
    (state) => ({
      currentSong: state.player.currentSong,
      lyrics: state.player.lyrics,
      lyricIndex: state.player.lyricIndex,
      playMode: state.player.playMode
    }),
    shallowEqual
  )

  useEffect(() => {
    // 获取歌曲的播放链接
    audioRef.current!.src = getSongUrl(currentSong.id)
    // 播放歌曲(当currentSong变化时，会执行该函数)
    audioRef.current
      ?.play()
      .then(() => {
        console.log('歌曲播放成功')
      })
      .catch((err) => {
        console.log('歌曲播放失败=>>', err)
      })
    // 设置歌曲总时长
    setDuration(currentSong.dt)
  }, [currentSong])

  // 点击播放，修改播放状态
  const handlePlayBtnClick = () => {
    const value = !isPlaying
    setIsPlaying(value)
    value
      ? audioRef.current?.play().catch(() => setIsPlaying(false))
      : audioRef.current?.pause()
  }

  // 监听audio元素的时间更新
  const handleTimeUpdate = () => {
    // 歌曲当前时长
    const currentTime = audioRef.current!.currentTime
    setCurrentTime(currentTime * 1000)

    // 歌曲当前进度(0-100)
    const progress = ((currentTime * 1000) / duration) * 100
    setProgress(progress)

    // 获取歌词索引
    let index = lyrics.length - 1
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i]
      if (lyric.time > currentTime * 1000) {
        index = i - 1
        break
      }
    }

    if (lyricIndex === index || index === -1) return
    // 修改歌词索引
    dispatch(changeLyricIndexAction(index))
    console.log(lyrics[index])
  }

  // 进度条发生变化 => 计算当前事件及进度
  const handleSliderChange = (value: number) => {
    const currentTime = ((value / 100) * duration) / 1000
    audioRef.current!.currentTime = currentTime
    setCurrentTime(currentTime)
    setProgress(value)
  }

  // 修改播放模式
  const handleLoop = () => {
    let newPlayMode = playMode + 1
    if (newPlayMode > 2) {
      newPlayMode = 0
    }
    dispatch(changePlayModeAction(newPlayMode))
  }

  // 点击上/下一首
  const handleChangeMusic = (isNext = true) => {
    dispatch(changeMusicAction(isNext))
  }

  // 监听audio元素的播放结束
  const handEnded = () => {
    if (playMode === 2) {
      audioRef.current!.currentTime = 0
      audioRef.current?.play()
    } else {
      handleChangeMusic()
    }
  }

  return (
    <PlayerBarWrapper className="sprite_playbar">
      <div className="content wrap-v2">
        <BarControl $isPlaying={isPlaying}>
          <button
            className="sprite_playbar btn prev"
            onClick={() => handleChangeMusic(false)}
          ></button>
          <button
            className="sprite_playbar btn play"
            onClick={handlePlayBtnClick}
          ></button>
          <button
            className="sprite_playbar btn next"
            onClick={() => handleChangeMusic()}
          ></button>
        </BarControl>
        <BarPlayerInfo>
          <Link to="/player">
            <img
              className="image"
              src={getImageSize(currentSong?.al?.picUrl, 50)}
              alt=""
            />
          </Link>
          <div className="info">
            <div className="song">
              <span className="song-name">{currentSong?.name}</span>
              <span className="singer-name">{currentSong?.ar?.[0]?.name}</span>
            </div>
            <div className="progress">
              <Slider
                value={progress}
                step={0.5}
                tooltip={{ formatter: null }}
                onChange={handleSliderChange}
              ></Slider>
              <div className="time">
                <span className="current">{formatTime(currentTime)}</span>
                <span className="divider">/</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </BarPlayerInfo>
        <BarOperator $playMode={playMode}>
          <div className="left">
            <button className="btn pip"></button>
            <button className="btn sprite_playbar favor"></button>
            <button className="btn sprite_playbar share"></button>
          </div>
          <div className="right sprite_playbar">
            <button className="btn sprite_playbar volume"></button>
            <button
              className="btn sprite_playbar loop"
              onClick={handleLoop}
            ></button>
            <button className="btn sprite_playbar playlist"></button>
          </div>
        </BarOperator>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handEnded}
      ></audio>
    </PlayerBarWrapper>
  )
}

export default memo(AppPlayerBar)
