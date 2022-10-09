import type { ReactNode } from "react"


export const LeftHeaderWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full mr-8 grid grid-cols-2 grid-flow-row items-center gap-4">{children}</div>
)

export const GameTitle = ({ title }: { title: string }) => <h1 className="font-serif">{title || "New Draft"}</h1>

export const RoundCounter = ({ children }: { children: ReactNode }) => (
  <div className="ml-2">{children}</div>
)



const Arrow = ({ up, className }: { up?: boolean, className?: string }) => (
  <svg viewBox="0 0 30 500" className={className}>
    { typeof up === 'boolean' && <path d={up ? "M 0 0 L 30 40 L 15 40 L 15 500 L 0 500 L 0 0 Z" : "M 0 0 L 15 0 L 15 460 L 30 460 L 0 500 L 0 0 Z"} /> }
  </svg>
)

export const PlayerContainersWrapper = ({ upArrow, children }: { upArrow?: boolean, children: ReactNode }) => (
  <div className="flex max-h-48 w-full">
    <div className="w-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 m-1">
        {children}
      </div>
    </div>
    <Arrow up={upArrow} className="h-48 w-2 ml-1 fill-base-content" />
  </div>
)

