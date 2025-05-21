import type { ReactNode } from "react"
import { GameBodyHeader } from "../GameBody/GameBodyStyles"

export { ErrorContainer } from "../GameLog/LogStyles"
export { TabToolbarWrapper } from "../GameLog/LogToolbar/LogToolbarStyles"
export { GameBodyWrapper as WatchBodyWrapper, RoundButton } from "../GameBody/GameBodyStyles"

export const WatchBodyHeader = ({ hide, children }: { hide?: boolean, children?: ReactNode }) => hide ?
  <div className="w-full h-20" /> : <GameBodyHeader>{children}</GameBodyHeader>

export const WatchGameLogWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex-grow">
    {children}
  </div>
)
