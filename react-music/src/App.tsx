import React, { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppPlayerBar from './views/player/app-player-bar'
import { useAppDispatch } from './store'
import { fetchCurrentSongAction } from './views/player/store/player'

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCurrentSongAction(2106790547))
  }, [])
  return (
    <div className="app">
      <AppHeader></AppHeader>
      <Suspense>
        <div className="main">{useRoutes(routes)}</div>
      </Suspense>
      <AppFooter></AppFooter>
      <AppPlayerBar></AppPlayerBar>
    </div>
  )
}
export default App
