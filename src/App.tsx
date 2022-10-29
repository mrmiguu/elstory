import { Howl } from 'howler'
import { CSSProperties, Fragment, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import { splitByPunctuation } from './appUtils'
import { randomColorPair } from './bgColors'
import { useRandomBibleVerse } from './bibleTranslations'
import svg__1F54A from './icons/1F54A.svg'
import { useMusic } from './music'
import sound__text from './sounds/jump.wav'
import { random, randomPick } from './utils'

const textSound = new Howl({ src: sound__text, volume: 0.2, preload: true })

type AnimatedTextProps = {
  children: string
  onComplete?: () => void
}

function AnimatedText({ children: text, onComplete }: AnimatedTextProps) {
  const words = text.split(/\s/)
  const [show, setShow] = useState(false)
  const [animating, setAnimating] = useState(true)
  const uniqueTextHash = useMemo(() => `${random()}`, [])

  useEffect(() => {
    setShow(true)
  }, [])

  useEffect(() => {
    if (!animating) onComplete?.()
  }, [animating]) // eslint-disable-line react-hooks/exhaustive-deps

  const disableAnimation = () => setAnimating(false)

  const randomX = randomPick([0, '50%', '100%'])
  const randomY = randomPick([0, '50%', '100%'])

  const elText = (
    <div>
      {words.map((word, w) => {
        const letters = word.split('')

        return (
          <Fragment key={`${w}`}>
            {w > 0 && ' '}

            <div className="inline-block origin-center">
              {letters.map((letter, l) => {
                const elLetter = (
                  <div
                    className={`inline-block ${!show && 'absolute -translate-x-1/2 -translate-y-1/2 opacity-0'}`}
                    style={{
                      left: show ? undefined : randomX,
                      top: show ? undefined : randomY,
                    }}
                  >
                    {letter}
                  </div>
                )

                const animatedOrStaticLetter = animating ? (
                  <Flipped
                    flipId={`Animatedtext-${w}-${l}-salt-${uniqueTextHash}`}
                    stagger
                    onStart={() => textSound.play()}
                  >
                    {elLetter}
                  </Flipped>
                ) : (
                  elLetter
                )

                return <Fragment key={`${l}`}>{animatedOrStaticLetter}</Fragment>
              })}
            </div>
          </Fragment>
        )
      })}
    </div>
  )

  const animatedOrStaticText = animating ? (
    <Flipper
      flipKey={`show=${show};text=${text}`}
      staggerConfig={{ default: { speed: 0.2 } }}
      spring="gentle"
      onComplete={disableAnimation}
    >
      {elText}
    </Flipper>
  ) : (
    elText
  )

  return animatedOrStaticText
}

type StoryPageProps = PropsWithChildren<{
  pageIndex: number
  flip?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}>

function StoryPage({ pageIndex, flip, className, style, onClick, children }: StoryPageProps) {
  const [hide, setHide] = useState(false)

  return (
    <Flipper flipKey={`book-pageIndex-${pageIndex}-flip-${flip}`}>
      <Flipped flipId={`pageIndex-${pageIndex}`} onComplete={() => setHide(flip ?? false)}>
        <div
          className={`w-full h-full flex justify-center items-center shadow-2xl ${flip && '-translate-x-full'} ${
            hide && 'hidden'
          } ${className}`}
          style={style}
          onClick={onClick}
        >
          {children}
        </div>
      </Flipped>
    </Flipper>
  )
}

function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState(-1)
  const [currentPageAnimating, setCurrentPageAnimating] = useState(false)
  const [topRightBgColor, bottomLeftBgColor] = useMemo(() => randomColorPair(), [])

  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const { chapter, chapterIndex } = useRandomBibleVerse('en_bbe')

  const subsetOfVerses = chapter?.slice(chapterIndex) ?? []
  const verseInParts = subsetOfVerses.reduce<string[]>((list, verse) => [...list, ...splitByPunctuation(verse)], [])

  const elPages = verseInParts.map((versePart, pageIndex) => (
    <StoryPage
      key={`${pageIndex}`}
      className="absolute top-0 left-0 px-10 text-2xl text-justify"
      style={{
        zIndex: verseInParts.length - 1 - pageIndex,
        backgroundImage: `linear-gradient(to bottom left, ${topRightBgColor}, ${bottomLeftBgColor})`,
      }}
      pageIndex={pageIndex}
      flip={currentPageIndex > pageIndex}
      onClick={goToNextPage}
    >
      <AnimatedText key={`${pageIndex}`} onComplete={() => setCurrentPageAnimating(false)}>
        {versePart}
      </AnimatedText>
    </StoryPage>
  ))

  const elSplashPage = (
    <StoryPage
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
    </StoryPage>
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

export default App
