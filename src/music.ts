import { Howl } from 'howler'
import { useEffect } from 'react'

// const backgroundMusic = new Howl({ src: music__JesusTime, volume: 0.5, preload: true })

import useAsync from 'react-use/lib/useAsync'
import { GlobDefaultImport } from './types'

type Song = 'JesusTime'

const musicModules = import.meta.glob<GlobDefaultImport<string>>('./music/*.mp3')

const fetchMusic = async (song: Song) =>
  new Howl({ src: (await musicModules[`./music/${song}.mp3`]!()).default, volume: 0.5, preload: true, loop: true })

function useMusic(song: Song | null) {
  const { value: audio } = useAsync(() => (song ? fetchMusic(song) : Promise.resolve(undefined)), [song])

  useEffect(() => {
    if (!audio) return

    audio.play()

    return () => {
      audio.stop()
    }
  }, [audio])
}

export type { Song }
export { musicModules, fetchMusic, useMusic }
