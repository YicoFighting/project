import request from '@/service'

export const getSongDetail = (ids: number) => {
  return request.get({
    url: '/song/detail',
    params: {
      ids
    }
  })
}

export const getSongLyric = (id: number) => {
  return request.get({
    url: '/lyric',
    params: {
      id
    }
  })
}
