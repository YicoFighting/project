import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  count: number
  message: string
  direction: 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP'
}

const initialState: IState = {
  count: 100,
  message: 'Hello Redux',
  direction: 'LEFT'
}
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeMessageAction(state, { payload }: PayloadAction<string>) {
      state.message = payload
    }
  }
})

export const { changeMessageAction } = counterSlice.actions

export default counterSlice.reducer
