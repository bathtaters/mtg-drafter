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
  <span className="flex justify-between items-center">{children}</span>
)

export const ContainerLabelStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex-shrink-0 flex items-center">{children}</span>
)

export const LandContainerStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex justify-evenly gap-0 md:gap-2">{children}</span>
)

export const CardCounter = ({ text }: { text: string }) => (
  <span className="badge badge-outline md:badge-lg align-top ml-2">{text}</span>
)

export const LandCounterStyle = ({ className = '', children }: { className?: string, children: ReactNode }) => (
  <span className={`badge badge-sm py-2 md:badge-lg ${className} flex gap-1`}>{children}</span>
)

