const { log, warn, error } = console
const { stringify, parse } = JSON
const { min, max, abs, random } = Math
const { keys, values, entries } = Object

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export { log, warn, error, stringify, parse, min, max, abs, random, keys, values, entries, sleep }
