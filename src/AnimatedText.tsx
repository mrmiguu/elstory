import { Howl } from 'howler'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import sound__text from './sounds/jump.wav'
import { random, randomPick } from './utils'

const textSound = new Howl({ src: sound__text, volume: 0.2, preload: true })

type AnimatedTextProps = {
  children: string
  onStart?: () => void
  onComplete?: () => void
}

function AnimatedText({ children: text, onStart, onComplete }: AnimatedTextProps) {
  const words = text.split(/\s/)
  const [show, setShow] = useState(false)
  const [animating, setAnimating] = useState(true)
  const uniqueTextHash = useMemo(() => `${random()}`, [])

  useEffect(() => {
    setShow(true)
  }, [])

  useEffect(() => {
    if (animating) onStart?.()
    else onComplete?.()
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

export default AnimatedText
