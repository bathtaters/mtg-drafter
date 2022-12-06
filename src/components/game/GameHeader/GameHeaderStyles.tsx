import type { MouseEventHandler, ReactNode } from "react"
import type { GameStatus } from "@prisma/client"
import LinkIcon from "components/svgs/LinkIcon"
import PackIcon from "components/svgs/PackIcon"

const statusIcon: { [status in GameStatus]: ReactNode } = {
  'start':  <span     className="inline-block mr-2 opacity-80 text-base sm:text-2xl fill-base-content ms ms-dfc-day"   />,
  'end':    <span     className="inline-block mr-2 opacity-80 text-base sm:text-2xl fill-base-content ms ms-dfc-night" />,
  'active': <PackIcon className="inline-block mr-2 opacity-80 h-6 sm:h-8 fill-base-100 stroke-base-content" />,
  'last':   <PackIcon className="inline-block mr-2 opacity-80 h-6 sm:h-8 fill-base-100 stroke-base-content" />,
}


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

export const RoundCounter = ({ label, status }: { label: ReactNode, status?: GameStatus }) => (
  <div className="ml-1 mt-2 text-base-content/80 flex items-center">
    {status && statusIcon[status]}
    <span>{label}</span>
  </div>
)



const Arrow = ({ right, width = 1500, className }: { right?: boolean, width?: number, className?: string }) => (
  <svg viewBox={`${right ? 10000 - width : 0} 0 ${width} 30`} className={className}>
    { typeof right === 'boolean' && <path d={
      right ? "M 0 30 L 10000 30 L 9960 0 L 9960 15 L 0 15 L 0 30 Z" :
        "M 0 30 L 10000 30 L 10000 15 L 40 15 L 40 0 L 0 30 Z"
    } /> }
  </svg>
)

export const PlayerContainersWrapper = ({ rightArrow, children }: { rightArrow?: boolean, children: ReactNode }) => (
  <div className="w-full md:col-span-2">
    <Arrow right={rightArrow} className="w-11/12 mb-1 mx-auto fill-base-content/50" />
    <div className="w-full max-h-28 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 m-1">
        {children}
      </div>
    </div>
  </div>
)

