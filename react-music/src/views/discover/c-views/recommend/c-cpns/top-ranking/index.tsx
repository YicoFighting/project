import React, { memo } from 'react'
import type { ReactNode } from 'react'
import { RankingWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import TopRankingItem from '../top-ranking-item'

interface IProps {
  children?: ReactNode
}

const TopRanking: React.FC<IProps> = () => {
  const { rankings = [] } = useAppSelector(
    (state) => ({
      rankings: state.recommend.rankings
    }),
    shallowEqual
  )
  return (
    <RankingWrapper>
      <AreaHeaderV1 title="榜单" moreLink="/discover/ranking"></AreaHeaderV1>
      <div className="content">
        {rankings.map((item) => {
          return <TopRankingItem key={item.id} itemData={item}></TopRankingItem>
        })}
      </div>
    </RankingWrapper>
  )
}

export default memo(TopRanking)
