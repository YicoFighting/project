import request from '@/service'

export const getBanners = () => {
  return request.get({
    url: '/banner'
  })
}

export const getHotRecommend = (limit = 30) => {
  return request.get({
    url: '/personalized',
    params: {
      limit
    }
  })
}

export const getNewAlbum = (limit = 10) => {
  return request.get({
    url: '/album/newest',
    params: {
      limit
    }
  })
}

export const getPlaylistDetail = (id: number) => {
  return request.get({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}

export const getArtistList = (limit = 30) => {
  return request.get({
    url: '/artist/list',
    params: {
      limit
    }
  })
}
