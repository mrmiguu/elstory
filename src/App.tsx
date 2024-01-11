import { useEffect, useMemo, useRef, useState } from 'react'
import useScroll from 'react-use/lib/useScroll'
import useWindowSize from 'react-use/lib/useWindowSize'
import VersePages from './VersePages'
import { useMusic } from './music'
import { max, randomPick } from './utils'

function App() {
  const versesWrapperRef = useRef<HTMLDivElement>(null)
  const { height: innerHeight } = useWindowSize(window.innerWidth, window.innerHeight)
  const { y: scrollY } = useScroll(versesWrapperRef)

  const currentVerse = ~~(scrollY / innerHeight)
  const [furthestVerseReached, setFurthestVerseReached] = useState(currentVerse)
  const nextFewVerses = furthestVerseReached + 3

  useEffect(() => {
    setFurthestVerseReached(max(currentVerse, furthestVerseReached))
  }, [currentVerse])

  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const [muted, _setMuted] = useState(false)

  const toggleMute = () => {
    _setMuted(oldMuted => {
      const muted = !oldMuted
      Howler.mute(muted)
      return muted
    })
  }

  const elOverlay = (
    <div className="fixed top-0 left-0 z-[998] w-full h-full pointer-events-none p-10 flex justify-end items-end">
      <div className="text-2xl text-white opacity-50 cursor-pointer pointer-events-auto" onClick={toggleMute}>
        {muted ? '🔇' : '🔈'}
      </div>
    </div>
  )

  return (
    <>
      <div
        ref={versesWrapperRef}
        className="absolute w-full h-full text-white bg-white"
        style={{
          overflowY: 'scroll',
          overflowX: 'hidden',
          scrollSnapType: 'y mandatory',
        }}
      >
        <VersePages parentRef={versesWrapperRef} splash />
        {[...Array(nextFewVerses)].map((_, i) => (
          <VersePages key={`${i}`} parentRef={versesWrapperRef} />
        ))}
      </div>

      {elOverlay}
    </>
  )
}

export default App
