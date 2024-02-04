import React, { memo } from 'react'
import type { ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Player: React.FC<IProps> = () => {
  return <div>Player</div>
}

export default memo(Player)
