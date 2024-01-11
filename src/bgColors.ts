export const bgColors = [
  '#ff0000',
  '#ff8700',
  '#ffd300',
  '#deff0a',
  '#a1ff0a',
  '#0aff99',
  '#0aefff',
  '#147df5',
  '#580aff',
  '#be0aff',
] as const

export type BgColor = (typeof bgColors)[number]

export const bgColorToBrightness: { [color: string]: 'light' | 'dark' } = {
  '#ff0000': 'dark',
  '#ff8700': 'dark',
  '#ffd300': 'light',
  '#deff0a': 'light',
  '#a1ff0a': 'light',
  '#0aff99': 'light',
  '#0aefff': 'light',
  '#147df5': 'dark',
  '#580aff': 'dark',
  '#be0aff': 'dark',
  '#000000': 'dark',
  '#ffffff': 'light',
}
