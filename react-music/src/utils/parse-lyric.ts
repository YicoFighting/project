export interface ILyric {
  time: number
  text: string
}
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export const parseLyric = (lyricString: string) => {
  const lines: string[] = lyricString.split('\n')

  const lyrics: ILyric[] = []

  for (const line of lines) {
    const result = timeRegExp.exec(line)
    if (!result) continue

    const mm = Number(result[1]) * 60 * 1000
    const ss = Number(result[2]) * 1000
    const ms =
      result[3].length === 3 ? Number(result[3]) : Number(result[3]) * 10

    const time = mm + ss + ms
    const text = line.replace(timeRegExp, '')
    lyrics.push({ time, text })
  }
  return lyrics
}
