import type { MouseEventHandler, ReactNode } from "react"

export const NoCardStyle = ({ children }:{ children: ReactNode }) => <div className="italic opacity-60 my-12">{children}</div>

export const NoCards = () => <NoCardStyle>Awaiting next pack.</NoCardStyle>

export const CardsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-4 flex-wrap justify-center">{children}</div>
)

export const CardWrapper = ({ isSelected, onClick, className, children }: { isSelected?: boolean, onClick?: MouseEventHandler, className: string, children: ReactNode }) => (
  <span
    onClick={onClick}
    className={`flex justify-center items-center relative rounded-xl${
      isSelected ? " outline outline-secondary outline-4 outline-offset-2" : ""
    } ${className}`}
  >
    <div className="pointer-events-none select-none">{children}</div>
  </span>
)


export const PickCardButton = ({ disabled, onClick }: { disabled?: boolean, onClick?: MouseEventHandler }) => (
  <div className="flex justify-center w-full mb-4">
    <button type="button" className="btn btn-secondary btn-lg w-60 h-18 mb-4" onClick={onClick} disabled={disabled}>
      Pick Card
    </button>
  </div>
)


export const FlipButton = ({ isBack, onClick }: { isBack?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick}
    className={`absolute bottom-0 left-0 z-30 btn btn-circle btn-sm ${isBack ? 'bg-base-content text-base-100 hover:bg-base-content' : ''} p-0 m-0 pointer-events-auto`}
  >
    <i className={`ms ${isBack ? 'ms-untap' : 'ms-tap'} w-full`} />
  </button>