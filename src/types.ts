type GlobImport<T = any> = {
  [key: string]: T
}

type GlobDefaultImport<T = any> = { default: T }

export type { GlobImport, GlobDefaultImport }
