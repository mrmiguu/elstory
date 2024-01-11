import { shuffle } from './utils'

const bgColors = ['#D03700', '#F29300', '#F9BE00', '#90C550', '#59B378', '#21a0a0', '#046865'] as const

type BgColor = (typeof bgColors)[number]

type RandomColorPairCache = {
  prevColorPair?: readonly [BgColor, BgColor]
}

const randomColorPair_cache: RandomColorPairCache = {}

function randomColorPair() {
  const [prevFirstColor, prevSecondColor] = randomColorPair_cache.prevColorPair ?? []
  const shuffledBgColors = shuffle(bgColors)
  let [firstColor, secondColor] = shuffledBgColors
  if (firstColor === prevFirstColor && secondColor === prevSecondColor) {
    firstColor = shuffledBgColors[1]
    secondColor = shuffledBgColors[2]
  }
  randomColorPair_cache.prevColorPair = [firstColor!, secondColor!]
  return [firstColor!, secondColor!] as const
}

export { bgColors, randomColorPair }
