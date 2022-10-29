const { log, warn, error } = console
const { stringify, parse } = JSON
const { min, max, abs, random } = Math
const { keys, values, entries } = Object

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const shuffle = <T = any>(arr: readonly T[]) => [...arr].sort(() => (random() < 0.5 ? -1 : 1))

const randomPick = <T = any>(arr: readonly T[]) => arr[~~(random() * arr.length)] as T

export { log, warn, error, stringify, parse, min, max, abs, random, keys, values, entries, sleep, shuffle, randomPick }
