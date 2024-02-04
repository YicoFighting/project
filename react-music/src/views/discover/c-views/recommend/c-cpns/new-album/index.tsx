import React, { memo, useRef, ElementRef } from 'react'
import type { ReactNode } from 'react'
import { AlbumWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { Carousel } from 'antd'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import NewAlbumItem from '@/components/new-album-item'

interface IProps {
  children?: ReactNode
}

const NewAlbum: React.FC<IProps> = () => {
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)

  const { newAlbums } = useAppSelector(
    (state) => ({
      newAlbums: state.recommend.newAlbums
    }),
    shallowEqual
  )
  const handlePrevClick = () => {
    bannerRef.current?.prev()
  }
  const handleNextClick = () => {
    bannerRef.current?.next()
  }
  return (
    <AlbumWrapper>
      <AreaHeaderV1 title="新碟上架" moreLink="/discover/album"></AreaHeaderV1>
      <div className="content">
        <button
          className="arrow arrow-left sprite_02"
          onClick={handlePrevClick}
        ></button>
        <div className="banner">
          <Carousel speed={1500} dots={false} ref={bannerRef}>
            {[0, 1].map((item) => {
              return (
                <div className="album-list" key={item}>
                  {newAlbums.slice(item * 5, (item + 1) * 5).map((album) => {
                    return (
                      <NewAlbumItem
                        key={album.id}
                        itemData={album}
                      ></NewAlbumItem>
                    )
                  })}
                </div>
              )
            })}
          </Carousel>
        </div>
        <button
          className="arrow arrow-right sprite_02"
          onClick={handleNextClick}
        ></button>
      </div>
    </AlbumWrapper>
  )
}

export default memo(NewAlbum)
