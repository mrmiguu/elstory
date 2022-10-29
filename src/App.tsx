import { Howl } from 'howler'
import { CSSProperties, Fragment, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import { splitByPunctuation } from './appUtils'
import { randomColorPair } from './bgColors'
import { useRandomBibleVerse } from './bibleTranslations'
import svg__1F54A from './icons/1F54A.svg'
import { useMusic } from './music'
import sound__text from './sounds/jump.wav'

const textSound = new Howl({ src: sound__text, volume: 0.2, preload: true })

type AnimatedTextProps = {
  children: string
  onComplete?: () => void
}

function AnimatedText({ children: text, onComplete }: AnimatedTextProps) {
  const words = text.split(/\s/)
  const [show, setShow] = useState(false)
  const [animating, setAnimating] = useState(true)
  const uniqueTextHash = useMemo(() => `${Math.random()}`, [])

  useEffect(() => {
    setShow(true)
  }, [])

  useEffect(() => {
    if (!animating) onComplete?.()
  }, [animating]) // eslint-disable-line react-hooks/exhaustive-deps

  const elText = (
    <div>
      {words.map((word, w) => {
        const letters = word.split('')

        return (
          <Fragment key={`${w}`}>
            {w > 0 && ' '}
            <div className="inline-block">
              {letters.map((letter, l) => {
                const elLetter = (
                  <div className={`inline-block ${!show && 'absolute right-0 top-0 opacity-0'}`}>{letter}</div>
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
    <Flipper flipKey={`show=${show};text=${text}`} spring="gentle" onComplete={() => setAnimating(false)}>
      {elText}
    </Flipper>
  ) : (
    elText
  )

  return animatedOrStaticText
}

type StoryPageProps = PropsWithChildren<{
  page: number
  flip?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}>

function StoryPage({ page, flip, className, style, onClick, children }: StoryPageProps) {
  const [hide, setHide] = useState(false)

  return (
    <Flipper flipKey={`book-genesis-page-${page}-flip-${flip}`}>
      <Flipped flipId={`page-${page}`} onComplete={() => setHide(flip ?? false)}>
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
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageAnimating, setCurrentPageAnimating] = useState(false)

  useMusic('JesusTime')

  const { chapter, chapterIndex } = useRandomBibleVerse('en_bbe')

  const verses = chapter?.slice(chapterIndex) ?? []

  const partialVerses = verses.reduce<string[]>((list, verse) => [...list, ...splitByPunctuation(verse)], [])

  const elPages = [
    <div className="flex items-end">
      <div className="font-[Quentin] text-7xl">
        <span className="font-bold">El</span>Story
      </div>
      <img className="w-24 -ml-3 pointer-events-none invert" src={svg__1F54A} alt="logo icon" />
    </div>,
    ...partialVerses.map((partialVerse, i) => (
      <AnimatedText key={`${i}`} onComplete={() => setCurrentPageAnimating(false)}>
        {partialVerse}
      </AnimatedText>
    )),
  ] as const

  const locked = currentPageAnimating || currentPage >= elPages.length

  function goToNextPage() {
    if (locked) return
    setCurrentPageAnimating(true)
    setCurrentPage(currentPage + 1)
  }

  const [topRightBgColor, bottomLeftBgColor] = useMemo(() => randomColorPair(), [])

  return (
    <div className="absolute w-full h-full text-white bg-white">
      {elPages.slice(0, currentPage).map((el, i) => {
        const page = i + 1

        return (
          <StoryPage
            key={`${page}`}
            className="absolute top-0 left-0 px-10 text-2xl text-justify"
            style={{
              zIndex: elPages.length - page,
              backgroundImage: `linear-gradient(to bottom left, ${topRightBgColor}, ${bottomLeftBgColor})`,
            }}
            page={page}
            flip={currentPage > page}
            onClick={goToNextPage}
          >
            {el}
          </StoryPage>
        )
      })}
    </div>
  )
}

export default App
