import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react'

export type MainContextState = {
  mutedSound: boolean
  mutedMusic: boolean
  toggleSound: () => void
  toggleMusic: () => void
}

export const MainContext = createContext<MainContextState>(undefined as unknown as MainContextState)

export function MainProvider({ children }: PropsWithChildren) {
  const [mutedSound, setMutedSound] = useState(false)
  const [mutedMusic, setMutedMusic] = useState(false)

  const toggleMusic = useCallback(() => setMutedMusic(m => !m), [setMutedMusic])
  const toggleSound = useCallback(() => setMutedSound(m => !m), [setMutedSound])

  const value = useMemo<MainContextState>(
    () => ({
      mutedSound,
      mutedMusic,
      toggleMusic,
      toggleSound,
    }),
    [mutedSound, mutedMusic, toggleMusic, toggleSound],
  )

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>
}
