import type { ReactNode, MouseEventHandler } from "react"
import type { GameStatus, TabLabels } from "@prisma/client"
import PackIcon from "components/svgs/PackIcon"
import DeckIcon from "components/svgs/DeckIcon"
import { titleCase } from "components/base/services/common.services"
import { hostButtonLabel } from "assets/strings"

export const containerIcon: Record<TabLabels, ReactNode> = {
  pack: <PackIcon className="h-7 fill-secondary-content stroke-secondary-focus mr-2 hidden sm:block" />,
  main: <DeckIcon className="h-7 fill-primary-content stroke-primary-focus mr-2 hidden sm:block" />,
  side: <DeckIcon className="h-7 fill-primary-focus stroke-primary-content opacity-70 mr-2 hidden sm:block" />,
}


export const TabsWrapper = ({ children }: { children: ReactNode }) => <div className="tabs tabs-boxed justify-center gap-2 mb-6 bg-transparent">{children}</div>


export const TabStyle = (
  { label, count, isSelected, onClick }: 
  { label: TabLabels, count?: string, isSelected?: boolean, onClick?: MouseEventHandler }
) => (
  <div
    className={`indicator tab tab-lg ${label === "pack" ? " tab-secondary" : " tab-primary"}${isSelected ? " tab-active" : ""}`}
    onClick={onClick} onMouseEnter={onClick}
  >
    {containerIcon[label]}
    <span className="text-2xl font-medium">{titleCase(label)}</span>
    {count && 
      <span className="indicator-item indicator-center indicator-bottom -bottom-1 whitespace-nowrap badge badge-sm sm:badge-md shadow shadow-black">
        {count}
      </span>
    }
  </div>
)


export const PickCardButton = ({ disabled, onClick }: { disabled?: boolean, onClick?: MouseEventHandler }) => (
  <div className="text-center w-full">
    <button type="button" className="btn btn-secondary btn-lg w-60 h-18 mb-4" onClick={onClick} disabled={disabled}>
      Pick Card
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


export const GameLayoutWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col text-center relative">{children}</div>
)
