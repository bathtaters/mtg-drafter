import { TabLabels, WatcherTabs } from "types/game"
import { type ReactNode, type MouseEventHandler, type CSSProperties, Fragment } from "react"
import PackIcon from "components/svgs/PackIcon"
import DeckIcon from "components/svgs/DeckIcon"
import GearIcon from "components/svgs/GearIcon"
import LogIcon from "components/svgs/LogIcon"
import UserIcon from "components/svgs/UserIcon"
import TimerIcon from "components/svgs/TimerIcon"
import { formatTime, camelToTitle } from "components/base/services/common.services"
import { hostButtonLabel } from "assets/strings"
import { redTimerSeconds } from "assets/constants"

export const containerIcon: Record<TabLabels | WatcherTabs | "select", ReactNode> = {
  pack: <PackIcon className="h-5 md:h-7 fill-secondary-content stroke-secondary mr-1 md:mr-2 hidden sm:block" />,
  main: <DeckIcon className="h-5 md:h-7 fill-primary-content stroke-primary mr-1 md:mr-2 hidden sm:block" />,
  side: <DeckIcon className="h-5 md:h-7 fill-primary stroke-primary-content opacity-70 mr-1 md:mr-2 hidden sm:block" />,
  select: <GearIcon className="h-5 md:h-7 fill-secondary mr-1 md:mr-2 hidden sm:block" />,
  log: <LogIcon className="h-5 md:h-7 fill-primary mr-1 md:mr-2 hidden sm:block" bgdClass="fill-primary-content" />,
  cards: <PackIcon className="h-5 md:h-7 fill-secondary-content stroke-secondary mr-1 md:mr-2 hidden sm:block" />,
  join: <UserIcon className="h-5 md:h-7 fill-secondary-content stroke-secondary mr-1 md:mr-2 hidden sm:block" />,
}

const primaryTabs = [TabLabels.pack, WatcherTabs.cards, WatcherTabs.join, "select"]


export const GameBodyHeader = ({ hide, children }: { hide?: boolean, children?: ReactNode }) => hide ?
  <div className="w-full h-20" /> : <div className="relative w-full max-w-6xl m-auto">{children}</div>

export const TabsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="tabs tabs-lg tabs-boxed justify-center gap-2 mb-6 bg-transparent">{children}</div>
)


export const TabStyle = (
  { label, badge, isSelected, onClick }: 
  { label: string, badge?: string, isSelected?: boolean, onClick?: MouseEventHandler }
) => (
  <div
    className={`indicator flex-nowrap tab ${primaryTabs.includes(label) ? " tab-secondary" : " tab-primary"}${isSelected ? " tab-active" : ""}`}
    onClick={onClick}
  >
    {containerIcon[label as keyof typeof containerIcon]}
    <span className="text-xl md:text-2xl font-medium">{camelToTitle(label)}</span>
    {badge && 
      <span className="indicator-item indicator-center indicator-bottom -bottom-1 whitespace-nowrap badge badge-neutral badge-sm sm:badge-md shadow shadow-black">
        {badge}
      </span>
    }
  </div>
)

export const TimerStyle = ({ seconds = 0, paused }: { seconds?: number, paused?: boolean }) => (
  <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-center p-2 rounded-box ${
    seconds < redTimerSeconds ? 'bg-error text-error-content' : 'bg-secondary text-secondary-content'
  } ${
    paused ? 'animate-pulse-pause' : 'opacity-80'
  } text-xs md:text-base`}>
    <div className={`fixed z-0 w-full inset-0 border-8 border-red-500 pointer-events-none ${
      seconds < redTimerSeconds && !paused ? 'border-opacity-80' : 'border-opacity-0'
    } motion-reduce:hidden animate-pulse transition-colors duration-500 ease-in-out`} />

    <TimerIcon className="w-5 fill-current" />
    
    <span className="countdown font-mono text-3xl md:text-5xl">
      { formatTime(seconds).map((value, idx) => (
        typeof value !== 'number' ? <Fragment key={`${idx}${value}`}>{value}</Fragment> :
          <span key={`${idx}num`} style={{"--value":value} as CSSProperties} />
      )) }
    </span>
  </div>
)


export const PickCardButton = ({ disabled, isEmpty, onClick }: { disabled?: boolean, isEmpty?: boolean, onClick?: MouseEventHandler }) => (
  <div className="text-center w-full">
    <button type="button" className="btn btn-secondary btn-lg w-60 h-18 mb-4" onClick={onClick} disabled={disabled && !isEmpty}>
      {!isEmpty ? "Pick Card" : "Pass Empty Pack"}
    </button>
  </div>
)


export const RoundButton = ({ disabled, label, onClick }: { disabled?: boolean, onClick: MouseEventHandler, label?: keyof typeof hostButtonLabel }) => 
  label && hostButtonLabel[label] && (
    <div className="w-full text-center my-4">
      <button type="button" onClick={onClick} disabled={disabled} className="btn btn-secondary btn-xl text-xl h-16 w-48 m-auto">
        {hostButtonLabel[label]}
      </button>
    </div>
  )


export const GameBodyWrapper = ({ className = '', children }: { className?: string, children?: ReactNode }) => (
  <div className={`flex flex-col text-center h-full relative ${className}`}>{children}</div>
)
