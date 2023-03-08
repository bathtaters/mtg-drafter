import type { GameStatus, TabLabels } from "@prisma/client"
import { ReactNode, MouseEventHandler, CSSProperties, Fragment } from "react"
import PackIcon from "components/svgs/PackIcon"
import DeckIcon from "components/svgs/DeckIcon"
import { formatTime, titleCase } from "components/base/services/common.services"
import { hostButtonLabel } from "assets/strings"
import { redTimerSeconds } from "assets/constants"
import TimerIcon from "components/svgs/TimerIcon"

export const containerIcon: Record<TabLabels, ReactNode> = {
  pack: <PackIcon className="h-5 md:h-7 fill-secondary-content stroke-secondary-focus mr-1 md:mr-2 hidden sm:block" />,
  main: <DeckIcon className="h-5 md:h-7 fill-primary-content stroke-primary-focus mr-1 md:mr-2 hidden sm:block" />,
  side: <DeckIcon className="h-5 md:h-7 fill-primary-focus stroke-primary-content opacity-70 mr-1 md:mr-2 hidden sm:block" />,
}


export const GameBodyHeader = ({ children }: { children?: ReactNode }) => <div className="relative w-full max-w-6xl m-auto">{children}</div>

export const TabsWrapper = ({ children }: { children: ReactNode }) => <div className="tabs tabs-boxed justify-center gap-2 mb-6 bg-transparent">{children}</div>


export const TabStyle = (
  { label, count, isSelected, onClick }: 
  { label: TabLabels, count?: string, isSelected?: boolean, onClick?: MouseEventHandler }
) => (
  <div
    className={`indicator flex-nowrap tab tab-lg ${label === "pack" ? " tab-secondary" : " tab-primary"}${isSelected ? " tab-active" : ""}`}
    onClick={onClick}
  >
    {containerIcon[label]}
    <span className="text-xl md:text-2xl font-medium">{titleCase(label)}</span>
    {count && 
      <span className="indicator-item indicator-center indicator-bottom -bottom-1 whitespace-nowrap badge badge-sm sm:badge-md shadow shadow-black">
        {count}
      </span>
    }
  </div>
)

export const TimerStyle = ({ seconds = 0 }: { seconds?: number }) => (
  <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-center p-2 rounded-box ${
    typeof seconds === 'number' && seconds < redTimerSeconds ? 'bg-error text-error-content' : 'bg-secondary text-secondary-content'
  } text-xs md:text-base opacity-80`}>
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


export const RoundButton = ({ label, onClick }: { onClick: MouseEventHandler, label?: GameStatus }) => (
  <div className="w-full text-center my-4">
    <button type="button" onClick={onClick} className="btn btn-secondary btn-xl text-xl h-16 w-48 m-auto">
      {label && hostButtonLabel[label]}
    </button>
  </div>
)


export const GameBodyWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col text-center relative">{children}</div>
)
