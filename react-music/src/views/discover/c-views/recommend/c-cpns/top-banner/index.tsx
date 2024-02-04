import React, { memo, useRef, useState } from 'react'
import type { ReactNode, ElementRef } from 'react'
import { BannerControl, BannerLeft, BannerRight, BannerWrapper } from './style'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import { Carousel } from 'antd'
import classNames from 'classnames'

interface IProps {
  children?: ReactNode
}

const TopBanner: React.FC<IProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { banners } = useAppSelector(
    (state) => ({
      banners: state.recommend.banners
    }),
    shallowEqual
  )

  const handleBeforeChange = () => {
    setCurrentIndex(-1)
  }
  const handleAfterChange = (current: number) => {
    setCurrentIndex(current)
  }

  const carouselRef = useRef<ElementRef<typeof Carousel>>(null)
  const handelePrevClick = () => {
    carouselRef.current?.prev()
  }
  const handeleNextClick = () => {
    carouselRef.current?.next()
  }

  // 获取背景图片
  let bgImageUrl
  if (currentIndex >= 0 && banners.length > 0) {
    bgImageUrl = banners[currentIndex]?.imageUrl + '?imageView&blur=40x20'
  }

  return (
    <BannerWrapper
      style={{ background: `url('${bgImageUrl}') center center / 6000px` }}
    >
      <div className="banner wrap-v2">
        <BannerLeft>
          <Carousel
            ref={carouselRef}
            autoplay
            effect="fade"
            dots={false}
            beforeChange={handleBeforeChange}
            afterChange={handleAfterChange}
          >
            {banners.map((item) => {
              return (
                <div className="banner-item" key={item.imageUrl}>
                  <img
                    className="image"
                    src={item.imageUrl}
                    alt={item.typeTitle}
                  />
                </div>
              )
            })}
          </Carousel>
          <ul className="dots">
            {banners.map((item, index) => {
              return (
                <li key={item.imageUrl}>
                  <span
                    className={classNames('item', {
                      active: index === currentIndex
                    })}
                  ></span>
                </li>
              )
            })}
          </ul>
        </BannerLeft>
        <BannerRight></BannerRight>
        <BannerControl>
          <button className="btn left" onClick={handelePrevClick}></button>
          <button className="btn right" onClick={handeleNextClick}></button>
        </BannerControl>
      </div>
    </BannerWrapper>
  )
}

export default memo(TopBanner)
