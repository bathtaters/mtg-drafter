import type { MouseEventHandler, ReactNode } from "react"
import type { Board } from "@prisma/client"
import { Direction } from "types/game.d"
import DeckIcon from "components/svgs/DeckIcon"

const dirClass: { [dir in Direction]: string } = { N: '', E: ' rotate-90', S: ' rotate-180', W: ' -rotate-90' }

export const CardWrapper = (
  { isSelected, isHighlighted, isFoil, direction = Direction.N, onClick, className, image, rendered, children }: {
    isSelected?: boolean, isHighlighted?: boolean, isFoil?: boolean, direction?: Direction,
    onClick?: MouseEventHandler, className: string, image?: ReactNode, rendered?: ReactNode, children?: ReactNode
  }
) => (
  <span
    onClick={onClick}
    className={`flex justify-center items-center relative group rounded-card${
      isSelected ? " outline outline-secondary" : isHighlighted ? " outline outline-error" : ""
    } outline-4 outline-offset-2 ${className}`}
  >
    <div className={`pointer-events-none select-none relative w-full h-full ${dirClass[direction]}${direction !== Direction.N ? ' z-30' : ''}`}>
      {isFoil && <div className="absolute w-full h-full z-50 bg-foil opacity-70 mix-blend-multiply" />}
      {image}
      {rendered}
    </div>
    {children}
  </span>
)


export const ImgWrapper = ({ isTop, children }: { isTop: boolean, children: ReactNode }) => (
  <div className={`absolute top-0 bottom-0 left-0 right-0 rounded-card overflow-hidden ${isTop ? "z-20" : "-z-10"}`}>
    {children}
  </div>
)


export const SwapButton = ({ board, low, onClick }: { board: Board, low?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} className={
      `hidden group-hover:flex absolute ${low ? 'top-[12em]' : 'top-[5em]'} left-[0.75em] z-30
      btn justify-center items-center gap-[0.5em] p-0 m-0 
      font-serif w-[5em] h-[3em] text-[1em] min-h-0
      pointer-events-auto opacity-50 hover:opacity-90`
  }>
    <span className="normal-case">{board === 'main' ? 'Side' : 'Main'}</span>
    <DeckIcon className={`h-[2em] inline ${board === 'main' ? "fill-base-content stroke-base-300" : "fill-base-300 stroke-base-content"}`} />
  </button>


export const FlipButton = ({ isBack, low, onClick }: { isBack?: boolean, low?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} onMouseEnter={onClick} onMouseLeave={onClick} className={
      `hidden group-hover:flex absolute ${low ? 'top-[8em]' : 'top-[3.5em]'} right-[0.75em] z-30
      btn btn-circle w-[2em] h-[2em] text-[1.5em] p-0 m-0 min-h-0 ${
        isBack ? 'bg-base-content text-base-100 hover:bg-base-content' : ''
      } pointer-events-auto opacity-50 hover:opacity-60`
  }>
    <i className={`ms ${isBack ? 'ms-untap' : 'ms-tap'} w-full`} />
  </button>

export const MeldBadge = () => (
  <div className="absolute top-[40%] left-[30%] w-2/5 h-auto z-30 font-serif text-[1.8em] badge p-[4%] opacity-80 pointer-events-none">
    Meld
  </div>
)