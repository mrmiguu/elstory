import QRCode from 'qrcode'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
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

  const [showModal, setShowModal] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!showModal) return

    const canvas = canvasRef.current

    QRCode.toCanvas(canvas, location.origin, err => {
      if (err) toast.error(err.message)
    })
  }, [showModal])

  useEffect(() => {
    setFurthestVerseReached(max(currentVerse, furthestVerseReached))
  }, [currentVerse])

  const randomSong = useMemo(() => randomPick(['JesusTime', 'JesusTime-slow', 'JesusTime-fast'] as const), [])
  useMusic(randomSong)

  const elOverlay = (
    <div className="fixed top-0 left-0 z-[998] w-full h-full pointer-events-none p-10 flex justify-end items-end">
      <div
        className="text-2xl text-white opacity-50 cursor-pointer pointer-events-auto"
        onClick={() => setShowModal(true)}
      >
        QR
      </div>
    </div>
  )

  const elModal = showModal && (
    <div
      className="fixed top-0 left-0 z-[999] w-full h-full flex justify-center items-center cursor-pointer bg-black/30"
      onClick={() => setShowModal(false)}
    >
      <div
        className="flex flex-col items-center gap-5 p-10 bg-white cursor-auto rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-2xl">Share ElStory🕊</div>
        <canvas
          className="scale-150 mix-blend-multiply"
          style={{
            imageRendering: 'pixelated',
          }}
          ref={canvasRef}
        />
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
      {elModal}
    </>
  )
}

export default App
