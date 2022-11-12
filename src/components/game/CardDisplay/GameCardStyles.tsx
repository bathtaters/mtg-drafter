import type { MouseEventHandler, ReactNode } from "react"
import type { ContainerType } from "./CardDisplay"

export const CardWrapper = ({ isSelected, onClick, className, children }: { isSelected?: boolean, onClick?: MouseEventHandler, className: string, children: ReactNode }) => (
  <span
    onClick={onClick}
    className={`flex justify-center items-center relative group rounded-[5%]${
      isSelected ? " outline outline-secondary outline-4 outline-offset-2" : ""
    } ${className}`}
  >
    <div className="pointer-events-none select-none relative w-full h-full">{children}</div>
  </span>
)

export const SwapButton = ({ board, onClick }: { board: ContainerType, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} className={
      `hidden group-hover:flex absolute top-[5em] left-[0.75em] z-30
      btn font-serif w-[4.5em] h-[3em] text-[1em] p-0 m-0 min-h-0
      pointer-events-auto opacity-50 hover:opacity-90`
  }>
    {board === 'Main' ? 'Side' : 'Main'}
  </button>


export const FlipButton = ({ isBack, onClick }: { isBack?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick} className={
      `hidden group-hover:flex absolute top-[3.5em] right-[0.75em] z-30
      btn btn-circle w-[2em] h-[2em] text-[1.5em] p-0 m-0 min-h-0 ${
        isBack ? 'bg-base-content text-base-100 hover:bg-base-content' : ''
      } pointer-events-auto opacity-50 hover:opacity-90`
  }>
    <i className={`ms ${isBack ? 'ms-untap' : 'ms-tap'} w-full`} />
  </button>