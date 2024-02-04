import React, { memo } from 'react'
import type { ReactNode } from 'react'
import { HotWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import SongMenuItem from '@/components/song-menu-item'

interface IProps {
  children?: ReactNode
}

const HotRecommend: React.FC<IProps> = () => {
  const { hotRecommends } = useAppSelector(
    (state) => ({
      hotRecommends: state.recommend.hotRecommend
    }),
    shallowEqual
  )
  return (
    <HotWrapper>
      <AreaHeaderV1
        title="热门推荐"
        keywords={['华语', '流行', '摇滚', '民谣', '电子']}
        moreLink="/discover/songs"
      ></AreaHeaderV1>
      <div className="recommend-list">
        {hotRecommends.map((item) => {
          return <SongMenuItem key={item.id} itemData={item}></SongMenuItem>
        })}
      </div>
    </HotWrapper>
  )
}

export default memo(HotRecommend)
