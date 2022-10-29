import { shuffle } from './utils'

const bgColors = [
  '#D03700',
  '#E53D00',
  '#F29300',
  '#F9BE00',
  '#90C550',
  '#59B378',
  '#21a0a0',
  '#138483',
  '#046865',
] as const

function randomColorPair() {
  const shuffledBgColors = shuffle(bgColors)
  const [firstColor, secondColor] = shuffledBgColors
  return [firstColor!, secondColor!] as const
}

export { bgColors, randomColorPair }
