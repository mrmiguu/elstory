const { log, warn, error } = console
const { stringify, parse } = JSON
const { min, max, abs, random } = Math
const { keys, values, entries } = Object

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const shuffle = <T = any>(arr: readonly T[]) => [...arr].sort(() => (random() < 0.5 ? -1 : 1))

const randomPick = <T = any>(arr: readonly T[]) => arr[~~(random() * arr.length)] as T

const fetchJSON = async <T extends object>(url: string) => {
  const resp = await fetch(url)
  const json: T = await resp.json()
  return json
}

export {
  abs,
  entries,
  error,
  fetchJSON,
  keys,
  log,
  max,
  min,
  parse,
  random,
  randomPick,
  shuffle,
  sleep,
  stringify,
  values,
  warn,
}
