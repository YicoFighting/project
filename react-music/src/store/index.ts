import { configureStore } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux'

import countReducer from './modules/counter'
import recommendReducer from '@/views/discover/c-views/recommend/store/recommend'
import playerReducer from '@/views/player/store/player'

const store = configureStore({
  reducer: {
    counter: countReducer,
    recommend: recommendReducer,
    player: playerReducer
  }
})
// const state = store.getState()
// type GetStateFnType = typeof state

type GetStateFnType = typeof store.getState
export type IRootState = ReturnType<GetStateFnType>
type DispatchType = typeof store.dispatch

// 函数调用签名 => (selector: (state: TState) => TSelected, equalityFn?: EqualityFn<NoInfer<TSelected>>)
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => DispatchType = useDispatch

export default store
