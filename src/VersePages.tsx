import { RefObject, useEffect, useRef, useState } from 'react'
import AnimatedText from './AnimatedText'
import VersePage from './VersePage'
import { splitByPunctuation } from './appUtils'
import { bgColorToBrightness } from './bgColors'
import { bgColorPermutations } from './bgColors.permutations'
import { useRandomBibleVerse } from './bibleTranslations'
import svg__1F54A from './icons/1F54A.svg'

type VersePages = {
  splash?: boolean
  parentRef: RefObject<HTMLDivElement>
}

function VersePages({ splash, parentRef }: VersePages) {
  const originalParentOverflowYRef = useRef<string | undefined>()
  const { bookIndex, book, chapterIndex, chapter, verseIndex, bibleJSON } = useRandomBibleVerse('en_bbe')

  const chapterNumber = chapterIndex + 1
  const verseNumberStart = verseIndex + 1
  const verseNumberEnd = chapter?.length

  const subsetOfVerses = chapter?.slice(verseIndex) ?? []
  const versePages = subsetOfVerses.reduce<string[]>((list, verse) => [...list, ...splitByPunctuation(verse)], [])

  const [currentPageIndex, setCurrentPageIndex] = useState(splash ? -1 : 0)
  const [currentPageAnimating, setCurrentPageAnimating] = useState(false)

  const bookProgress = bibleJSON ? bookIndex / bibleJSON.length : undefined
  const bgColorPermutationIndex = bookProgress === undefined ? -1 : ~~(bgColorPermutations.length * bookProgress)

  const [bottomLeftBgColor = '#ffffff', topRightBgColor = '#ffffff'] =
    bgColorPermutations[bgColorPermutationIndex] ?? []

  const bottomLeftBrightness = bgColorToBrightness[bottomLeftBgColor]
  const topRightBrightness = bgColorToBrightness[topRightBgColor]

  const isLight = topRightBrightness === 'light' && bottomLeftBrightness === 'light'

  const splashLocked = currentPageIndex <= -1
  const locked = !splashLocked && (currentPageAnimating || currentPageIndex >= versePages.length - 1)
  const versePageCursor = locked ? 'cursor-auto' : 'cursor-pointer'

  useEffect(() => {
    const parent = parentRef.current
    if (!splash || !parent) return

    originalParentOverflowYRef.current = originalParentOverflowYRef.current ?? parent.style.overflowY
    parent.style.overflowY = splashLocked ? 'hidden' : originalParentOverflowYRef.current
  })

  function goToNextPage() {
    if (locked) return
    setCurrentPageIndex(currentPageIndex + 1)
  }

  const elTemporarySplashPage = splash && (
    <VersePage
      className={`absolute top-0 left-0 px-10 text-2xl text-justify ${
        isLight ? 'text-black' : 'text-white'
      } ${versePageCursor}`}
      style={{
        zIndex: versePages.length,
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
        <img className={`w-24 -ml-3 pointer-events-none ${!isLight && 'invert'}`} src={svg__1F54A} alt="logo icon" />
      </div>
    </VersePage>
  )

  const elVerses = (
    <div
      className={`relative w-full h-full ${isLight ? 'text-black' : 'text-white'}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      {versePages.slice(0, currentPageIndex + 1).map((versePart, pageIndex) => (
        <VersePage
          key={`${pageIndex}`}
          className={`absolute top-0 left-0 px-10 text-2xl text-justify ${versePageCursor}`}
          style={{
            zIndex: versePages.length - 1 - pageIndex,
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

          <div className="absolute bottom-0 left-0 p-10 text-xs opacity-75">
            {book?.name} {chapterNumber}:{verseNumberStart}-{verseNumberEnd}
          </div>
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
