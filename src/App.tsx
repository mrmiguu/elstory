import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import useScroll from 'react-use/lib/useScroll'
import useWindowSize from 'react-use/lib/useWindowSize'
import VersePages from './VersePages'
import { MainContext } from './main.context'
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

  const { mutedMusic, mutedSound, toggleMusic, toggleSound } = useContext(MainContext)

  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(m => !m)

  const elMenu = (
    <div className="fixed top-0 left-0 z-[998] w-full h-full pointer-events-none p-5 flex justify-end items-end">
      {showMenu && (
        <div
          className="absolute left-0 top-0 w-full h-full bg-white/65 backdrop-blur-sm pointer-events-auto"
          onClick={toggleMenu}
        />
      )}

      <div className="relative">
        <div className="flex flex-col gap-10">
          {showMenu && (
            <>
              <div
                className="flex justify-center items-center w-6 h-6 cursor-pointer pointer-events-auto"
                onClick={toggleMusic}
              >
                <div className="relative text-2xl">
                  🎵
                  {mutedMusic && <div className="absolute left-0 top-0 opacity-65">🚫</div>}
                </div>
              </div>

              <div
                className="flex justify-center items-center w-6 h-6 cursor-pointer pointer-events-auto"
                onClick={toggleSound}
              >
                <span className="text-2xl">{mutedSound ? '🔇' : '🔈'}</span>
              </div>
            </>
          )}

          <div
            className={`flex justify-center items-center w-6 h-6 transition-transform cursor-pointer pointer-events-auto ${
              !showMenu && 'rotate-90'
            }`}
            onClick={toggleMenu}
          >
            <span className="text-white text-3xl">Ⅲ</span>
          </div>
        </div>
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

      {elMenu}
    </>
  )
}

export default App
