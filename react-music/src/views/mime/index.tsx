import React, { memo } from 'react'
import type { ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Mime: React.FC<IProps> = () => {
  return <div>Mime</div>
}

export default memo(Mime)
