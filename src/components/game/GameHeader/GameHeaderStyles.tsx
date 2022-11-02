import type { MouseEventHandler, ReactNode } from "react"
import LinkIcon from "components/svgs/LinkIcon"


export const GameHeaderWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-4">{children}</div>
)

export const GameTitle = ({ title, onClick }: { title: string, onClick?: MouseEventHandler }) => (
  <div>
    <h1 className="font-serif inline">{title || "New Draft"}</h1>
    {onClick &&
      <a className="link align-top" onClick={onClick}>
        <LinkIcon className="w-5 h-auto ml-2 fill-primary hover:fill-primary-focus inline-block" />
      </a>
    }
  </div>
)

export const RoundCounter = ({ children }: { children: ReactNode }) => (
  <div className="ml-2 mt-2 text-base-content/80">{children}</div>
)



const Arrow = ({ left, width = 1500, className }: { left?: boolean, width?: number, className?: string }) => (
  <svg viewBox={`0 0 ${width} 30`} className={className}>
    { typeof left === 'boolean' && <path d={left ? "M 0 30 L 10000 30 L 9960 0 L 9960 15 L 0 15 L 0 30 Z" : "M 0 30 L 10000 30 L 10000 15 L 40 15 L 40 0 L 0 30 Z"} /> }
  </svg>
)

export const PlayerContainersWrapper = ({ upArrow, children }: { upArrow?: boolean, children: ReactNode }) => (
  <div className="w-full md:col-span-2">
    <Arrow left={upArrow} className="w-11/12 mb-1 mx-auto fill-base-content/50" />
    <div className="w-full max-h-28 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 m-1">
        {children}
      </div>
    </div>
  </div>
)

