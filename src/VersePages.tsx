import { useMemo, useState } from 'react'
import AnimatedText from './AnimatedText'
import { randomColorPair } from './bgColors'
import svg__1F54A from './icons/1F54A.svg'
import VersePage from './VersePage'

type VersePages = {
  pages: string[]
  splash?: boolean
}

function VersePages({ pages, splash }: VersePages) {
  const [currentPageIndex, setCurrentPageIndex] = useState(splash ? -1 : 0)
  const [currentPageAnimating, setCurrentPageAnimating] = useState(false)
  const [topRightBgColor, bottomLeftBgColor] = useMemo(() => randomColorPair(), [])

  const splashLocked = currentPageIndex <= -1
  const locked = !splashLocked && (currentPageAnimating || currentPageIndex >= pages.length - 1)
  const versePageCursor = locked ? 'cursor-wait' : 'cursor-pointer'

  function goToNextPage() {
    if (locked) return
    setCurrentPageIndex(currentPageIndex + 1)
  }

  const elTemporarySplashPage = splash && (
    <VersePage
      className={`absolute top-0 left-0 px-10 text-2xl text-justify ${versePageCursor}`}
      style={{
        zIndex: pages.length,
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

  const elVerses = (
    <div className="relative w-full h-full" style={{ scrollSnapAlign: 'start' }}>
      {pages.slice(0, currentPageIndex + 1).map((versePart, pageIndex) => (
        <VersePage
          key={`${pageIndex}`}
          className={`absolute top-0 left-0 px-10 text-2xl text-justify ${versePageCursor}`}
          style={{
            zIndex: pages.length - 1 - pageIndex,
            backgroundImage: `linear-gradient(to bottom left, ${topRightBgColor}, ${bottomLeftBgColor})`,
          }}
          pageIndex={pageIndex}
          flip={currentPageIndex > pageIndex}
          onClick={goToNextPage}
        >
          <AnimatedText
            key={`${pageIndex}`}
            onStart={() => setCurrentPageAnimating(true)}
            onComplete={() => setCurrentPageAnimating(false)}
          >
            {versePart}
          </AnimatedText>
        </VersePage>
      ))}
    </div>
  )

  return (
    <>
      {elTemporarySplashPage}
      {elVerses}
    </>
  )
}

export default VersePages
