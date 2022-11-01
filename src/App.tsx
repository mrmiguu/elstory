import { useEffect, useMemo, useRef, useState } from 'react'
import useScroll from 'react-use/lib/useScroll'
import useWindowSize from 'react-use/lib/useWindowSize'
import { useMusic } from './music'
import { max, randomPick } from './utils'
import VersePages from './VersePages'

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

  const elOverlay = (
    <div className="fixed top-0 left-0 z-[999] w-full h-full pointer-events-none">
      <div>currentVerse={currentVerse}</div>
      <div>furthestVerseReached={furthestVerseReached}</div>
    </div>
  )

  return (
    <>
      <div
        ref={versesWrapperRef}
        className="absolute w-full h-full text-white bg-white"
        style={{
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}
      >
        <VersePages parentRef={versesWrapperRef} splash />
        {[...Array(nextFewVerses)].map((_, i) => (
          <VersePages key={`${i}`} parentRef={versesWrapperRef} />
        ))}
      </div>

      {/* {elOverlay} */}
    </>
  )
}

export default App
