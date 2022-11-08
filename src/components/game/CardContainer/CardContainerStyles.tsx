import type { MouseEventHandler, ReactNode } from "react"
import CollapseContainer from "components/base/common/Collapse"
import { EmptyStyle } from "components/base/styles/AppStyles"

export const NoCards = () => <EmptyStyle>Awaiting next pack.</EmptyStyle>
export const NoPacks = () => <EmptyStyle>Awaiting next round.</EmptyStyle>

export const CardContainerWrapper = ({ title, defaultOpen, isPrimary, children, onClick }: {
   title: ReactNode, defaultOpen: boolean, isPrimary: boolean, children: ReactNode, onClick?: MouseEventHandler
}) => (
  <CollapseContainer title={title} defaultOpen={defaultOpen}
    className={`relative rounded-lg shadow-md shadow-black ${isPrimary ? 'text-primary bg-primary-content/40' : 'text-secondary bg-secondary-content/40'}`}
  >
    <span onClick={onClick}>{children}</span>
  </CollapseContainer>
)

export const ContainerHeaderStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex justify-between items-center">{children}</span>
)

export const ContainerLabelStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex-shrink-0 flex items-center">{children}</span>
)

export const LandContainerStyle = ({ onClick, children }: { onClick?: MouseEventHandler, children: ReactNode }) => (
  <button type="button" onClick={onClick} className="relative z-20 flex justify-evenly gap-0 md:gap-2">{children}</button>
)

export const CardCounter = ({ text }: { text: string }) => (
  <span className="badge badge-outline md:badge-lg align-top ml-2">{text}</span>
)

export const LandCounterStyle = ({ className = '', children }: { className?: string, children: ReactNode }) => (
  <span className={`badge badge-sm py-2 md:badge-lg ${className} flex gap-1`}>{children}</span>
)

export const LandButton = () => <span className="btn btn-circle btn-sm btn-outline"><i className="ms ms-land text-base" /></span>

export const CardsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-4 flex-wrap justify-center">{children}</div>
)