import React from 'react'
import { Navigate } from 'react-router-dom'
import { type RouteObject } from 'react-router-dom'

const Discover = React.lazy(() => import('@/views/discover'))
const Mime = React.lazy(() => import('@/views/mime'))
const Focus = React.lazy(() => import('@/views/focus'))
const Download = React.lazy(() => import('@/views/download'))
const Recommend = React.lazy(() => import('@/views/discover/c-views/recommend'))
const Ranking = React.lazy(() => import('@/views/discover/c-views/ranking'))
const Songs = React.lazy(() => import('@/views/discover/c-views/songs'))
const Djradio = React.lazy(() => import('@/views/discover/c-views/djradio'))
const Artist = React.lazy(() => import('@/views/discover/c-views/artist'))
const Album = React.lazy(() => import('@/views/discover/c-views/album'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/discover"></Navigate>
  },
  {
    path: '/discover',
    element: <Discover />,
    children: [
      {
        path: '/discover',
        element: <Navigate to="/discover/recommend"></Navigate>
      },
      {
        path: '/discover/recommend',
        element: <Recommend></Recommend>
      },
      {
        path: '/discover/ranking',
        element: <Ranking></Ranking>
      },
      {
        path: '/discover/songs',
        element: <Songs></Songs>
      },
      {
        path: '/discover/djradio',
        element: <Djradio></Djradio>
      },
      {
        path: '/discover/artist',
        element: <Artist></Artist>
      },
      {
        path: '/discover/album',
        element: <Album></Album>
      }
    ]
  },
  {
    path: '/mime',
    element: <Mime />
  },
  {
    path: '/focus',
    element: <Focus />
  },
  {
    path: '/download',
    element: <Download />
  }
]

export default routes
