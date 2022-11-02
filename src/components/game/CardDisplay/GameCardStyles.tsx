import type { MouseEventHandler, ReactNode } from "react"

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

export const FlipButton = ({ isBack, onClick }: { isBack?: boolean, onClick?: MouseEventHandler }) =>
  <button type="button" onClick={onClick}
    className={`absolute bottom-0 left-0 z-30 btn btn-circle btn-sm ${isBack ? 'bg-base-content text-base-100 hover:bg-base-content' : ''} p-0 m-0 pointer-events-auto`}
  >
    <i className={`ms ${isBack ? 'ms-untap' : 'ms-tap'} w-full`} />
  </button>