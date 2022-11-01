import { useMemo, useState } from 'react'
import AnimatedText from './AnimatedText'
import { splitByPunctuation } from './appUtils'
import { randomColorPair } from './bgColors'
import { useRandomBibleVerse } from './bibleTranslations'
import svg__1F54A from './icons/1F54A.svg'
import { useMusic } from './music'
import { randomPick } from './utils'
import VersePage from './VersePage'
import VersePages from './VersePages'

function _App() {
  const [currentPageIndex, setCurrentPageIndex] = useState(-1)
  const [currentPageAnimating, setCurrentPageAnimating] = useState(false)
  const [topRightBgColor, bottomLeftBgColor] = useMemo(() => randomColorPair(), [])

  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const { chapter, chapterIndex } = useRandomBibleVerse('en_bbe')

  const subsetOfVerses = chapter?.slice(chapterIndex) ?? []
  const versePages = subsetOfVerses.reduce<string[]>((list, verse) => [...list, ...splitByPunctuation(verse)], [])

  const elPages = versePages.map((versePart, pageIndex) => (
    <VersePage
      key={`${pageIndex}`}
      className="absolute top-0 left-0 px-10 text-2xl text-justify"
      style={{
        zIndex: versePages.length - 1 - pageIndex,
        backgroundImage: `linear-gradient(to bottom left, ${topRightBgColor}, ${bottomLeftBgColor})`,
      }}
      pageIndex={pageIndex}
      flip={currentPageIndex > pageIndex}
      onClick={goToNextPage}
    >
      <AnimatedText key={`${pageIndex}`} onComplete={() => setCurrentPageAnimating(false)}>
        {versePart}
      </AnimatedText>
    </VersePage>
  ))

  const elSplashPage = (
    <VersePage
      className="absolute top-0 left-0 px-10 text-2xl text-justify"
      style={{
        zIndex: elPages.length,
        backgroundImage: `linear-gradient(to bottom left, ${topRightBgColor}, ${bottomLeftBgColor})`,
      }}
      pageIndex={-1}
      flip={currentPageIndex > -1}
      onClick={goToNextPage}
    >
      <div className="flex items-end">
        <div className="font-[Quentin] text-7xl">
          <span className="font-bold">El</span>Story
        </div>
        <img className="w-24 -ml-3 pointer-events-none invert" src={svg__1F54A} alt="logo icon" />
      </div>
    </VersePage>
  )

  const splashLocked = currentPageIndex <= -1
  const locked = !splashLocked && (currentPageAnimating || currentPageIndex >= elPages.length - 1)

  function goToNextPage() {
    if (locked) return
    setCurrentPageAnimating(true)
    setCurrentPageIndex(currentPageIndex + 1)
  }

  const elVerses = [...Array(splashLocked ? 1 : 1)].map((_, i) => (
    <div key={`${i}`} className="relative w-full h-full" style={{ scrollSnapAlign: 'start' }}>
      {elPages.slice(0, currentPageIndex + 1)}
    </div>
  ))

  return (
    <div
      className="absolute w-full h-full text-white bg-white"
      style={{
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      {elSplashPage}
      {elVerses}
    </div>
  )
}

function App() {
  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const { chapter, chapterIndex } = useRandomBibleVerse('en_bbe')

  const subsetOfVerses = chapter?.slice(chapterIndex) ?? []
  const versePages = subsetOfVerses.reduce<string[]>((list, verse) => [...list, ...splitByPunctuation(verse)], [])

  return (
    <div
      className="absolute w-full h-full text-white bg-white"
      style={{
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      <VersePages pages={versePages} />
    </div>
  )
}

export default App
