import type { MouseEventHandler, ReactNode } from "react"
import CollapseContainer from "components/base/common/Collapse"


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
  <span className="flex justify-between">{children}</span>
)

export const CardCounter = ({ count }: { count?: number }) => (
  <span className="badge badge-outline badge-lg align-top ml-2">{count ?? '–'}</span>
)

export const CounterContainerStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex justify-evenly gap-2">{children}</span>
)
export const LandCounterStyle = ({ className = '', children }: { className?: string, children: ReactNode }) => (
  <span className={`badge ${className} flex gap-1`}>{children}</span>
)

