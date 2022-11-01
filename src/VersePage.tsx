import { CSSProperties, PropsWithChildren, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

type VersePageProps = PropsWithChildren<{
  pageIndex: number
  flip?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}>

function VersePage({ pageIndex, flip, className, style, onClick, children }: VersePageProps) {
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

export default VersePage
