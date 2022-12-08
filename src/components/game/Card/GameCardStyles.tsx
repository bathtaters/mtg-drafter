import type { Board } from "@prisma/client"
import type { MouseEventHandler, ReactNode } from "react"
import DeckIcon from "components/svgs/DeckIcon"

export const CardWrapper = ({ isSelected, isFoil, onClick, className, children }: { isSelected?: boolean, isFoil?: boolean, onClick?: MouseEventHandler, className: string, children: ReactNode }) => (
  <span
    onClick={onClick}
    className={`flex justify-center items-center relative group rounded-card${
      isSelected ? " outline outline-secondary outline-4 outline-offset-2" : ""
    } ${className}`}
  >
    <div className="pointer-events-none select-none relative w-full h-full">
      {isFoil && <div className="absolute w-full h-full z-50 bg-foil opacity-70 mix-blend-multiply" />}
      {children}
    </div>
  </span>
)

export const ImgWrapper = ({ isTop, rotate, children }: { isTop: boolean, rotate: boolean, children: ReactNode }) => (
  <div className={`absolute top-0 bottom-0 left-0 right-0 rounded-card overflow-hidden${rotate ? " rotate-180" : ""} ${isTop ? "z-20" : "-z-10"}`}>
    {children}
  </div>
)


export const SwapButton = ({ board, onClick }: { board: Board, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} className={
      `hidden group-hover:flex absolute top-[5em] left-[0.75em] z-30
      btn justify-center items-center gap-[0.5em] p-0 m-0 
      font-serif w-[5em] h-[3em] text-[1em] min-h-0
      pointer-events-auto opacity-50 hover:opacity-90`
  }>
    <span className="normal-case">{board === 'main' ? 'Side' : 'Main'}</span>
    <DeckIcon className={`h-[2em] inline ${board === 'main' ? "fill-base-content stroke-base-300" : "fill-base-300 stroke-base-content"}`} />
  </button>


export const FlipButton = ({ isBack, onClick }: { isBack?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} onMouseEnter={onClick} onMouseLeave={onClick} className={
      `hidden group-hover:flex absolute top-[3.5em] right-[0.75em] z-30
      btn btn-circle w-[2em] h-[2em] text-[1.5em] p-0 m-0 min-h-0 ${
        isBack ? 'bg-base-content text-base-100 hover:bg-base-content' : ''
      } pointer-events-auto opacity-50 hover:opacity-90`
  }>
    <i className={`ms ${isBack ? 'ms-untap' : 'ms-tap'} w-full`} />
  </button>