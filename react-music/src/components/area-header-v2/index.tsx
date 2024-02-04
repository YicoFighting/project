import React, { memo } from 'react'
import type { ReactNode } from 'react'
import { HeaderV2Wrapper } from './style'

interface IProps {
  children?: ReactNode
  title?: string
  moreText?: string
  moreLink?: string
}

const AreaHeaderV2: React.FC<IProps> = (props) => {
  const { title = '默认标题', moreText, moreLink } = props
  return (
    <HeaderV2Wrapper>
      <h3 className="title">{title}</h3>
      {moreText && moreLink && <a href="/discover/artist">查看全部 &gt;</a>}
    </HeaderV2Wrapper>
  )
}

export default memo(AreaHeaderV2)
