import React, { PureComponent } from 'react'
import type { ReactNode } from 'react'

interface Iprops {
  name?: string
}

interface Istate {
  message: string
}

class Demo extends PureComponent<Iprops, Istate> {
  state = {
    message: 'Hello World'
  }

  render(): ReactNode {
    return (
      <div>
        {this.props.name}
        {this.state.message}
      </div>
    )
  }
}

export default Demo
