import { MouseEventHandler, ReactNode } from "react"
import CollapseContainer from "../../base/common/Collapse"

export const NoCardStyle = ({ children }:{ children: ReactNode }) => <div className="italic opacity-60">{children}</div>

export const NoCards = () => <NoCardStyle>Awaiting next pack.</NoCardStyle>

export const NoCardsPip = () => <span className="text-error font-bold">• </span>


export const CardContainerWrapper = ({ title, defaultOpen, children }: { title: ReactNode, defaultOpen: boolean, children: ReactNode }) => (
  <CollapseContainer title={title} defaultOpen={defaultOpen} className="bg-secondary-content text-secondary rounded-lg">
    {children}
  </CollapseContainer>
)

export const CardsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-4 flex-wrap justify-center">{children}</div>
)

export const CardWrapper = ({ isSelected, onClick, children }: { isSelected?: boolean, onClick?: MouseEventHandler, children: ReactNode }) => (
  <span
    onClick={onClick}
    className={
      "flex justify-center items-center w-52 h-80 border rounded text-4xl"+
      (isSelected ? " outline outline-secondary outline-4 outline-offset-2" : "")
    }
  >
    <div className="pointer-events-none select-none">{children}</div>
  </span>
)


export const PickCardButton = ({ disabled, onClick }: { disabled?: boolean, onClick?: MouseEventHandler }) => (
  <div className="flex justify-center w-full mb-4">
    <button type="button" className="btn btn-secondary btn-lg w-60 h-18" onClick={onClick} disabled={disabled}>
      Pick Card
    </button>
  </div>
)