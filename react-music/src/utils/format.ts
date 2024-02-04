export const formatCount = (count: number) => {
  if (count > 100000) {
    return Math.floor(count / 10000) + '万'
  } else {
    return count
  }
}

export const getImageSize = (
  imgUrl: string,
  width: number,
  height: number = width
) => {
  return imgUrl + `?param=${width}y${height}`
}

export const formatTime = (time: number) => {
  const timeSeconds = time / 1000

  const mm = String(Math.floor(timeSeconds / 60)).padStart(2, '0')
  const ss = String(Math.floor(timeSeconds % 60)).padStart(2, '0')
  return `${mm}:${ss}`
}
