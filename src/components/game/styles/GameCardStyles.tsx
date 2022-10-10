import type { MouseEventHandler, ReactNode } from "react"
import CollapseContainer from "components/base/common/Collapse"

export const NoCardStyle = ({ children }:{ children: ReactNode }) => <div className="italic opacity-60">{children}</div>

export const NoCards = () => <NoCardStyle>Awaiting next pack.</NoCardStyle>

export const CardCounter = ({ count }: { count?: number }) => (
  <span className="badge badge-outline badge-lg align-top ml-2">{count ?? '–'}</span>
)


export const CardContainerWrapper = ({ title, defaultOpen, isPrimary, children, onClick }: {
   title: ReactNode, defaultOpen: boolean, isPrimary: boolean, children: ReactNode, onClick?: MouseEventHandler
}) => (
  <CollapseContainer title={title} defaultOpen={defaultOpen}
    className={`relative rounded-lg shadow-md shadow-black ${isPrimary ? 'text-primary bg-primary-content/40' : 'text-secondary bg-secondary-content/40'}`}
  >
    <span onClick={onClick}>{children}</span>
  </CollapseContainer>
)

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
    <button type="button" className="btn btn-secondary btn-lg w-60 h-18" onClick={onClick} disabled={disabled}>
      Pick Card
    </button>
  </div>
)