import type { MouseEventHandler, ReactNode } from "react"
import { EmptyStyle } from "components/base/styles/AppStyles"

export const NoPack = () => <EmptyStyle>Awaiting next pack.</EmptyStyle>
export const EmptyPack = () => <EmptyStyle>Awaiting next round.</EmptyStyle>
export const EmptyBoard = () => <EmptyStyle>No cards.</EmptyStyle>
export const LoadingPack = () => <EmptyStyle>Loading pack.</EmptyStyle>

export const CardContainerWrapper = ({ title, isPrimary, children, onClick }: {
   title: ReactNode, isPrimary: boolean, children: ReactNode, onClick?: MouseEventHandler
}) => (
  <div onClick={onClick} className={
    `relative rounded-lg shadow-md shadow-black ${
      isPrimary ? 'text-primary bg-primary-content/40' : 'text-secondary bg-secondary-content/40'
    }`
  }>
    <div className="min-h-16 p-4 text-left text-xl font-medium">{title}</div>
    <div className="px-4 pb-8">{children}</div>
  </div>
)

export const ContainerHeaderStyle = ({ children }: { children: ReactNode }) => (
  <span className="grid grid-cols-3 items-start">{children}</span>
)

export const ContainerLabelStyle = ({ children }: { children: ReactNode }) => (
  <span className="flex items-center">{children}</span>
)

export const LandContainerStyle = ({ onClick, children }: { onClick?: MouseEventHandler, children: ReactNode }) => (
  <button type="button" onClick={onClick} className="relative z-20 flex justify-end gap-0 md:gap-2">{children}</button>
)

export const CardCounter = ({ text = '–' }: { text?: string }) => (
  <span className="badge badge-outline md:badge-lg align-top ml-2 whitespace-nowrap text-sm">{text}</span>
)

export const LandCounterStyle = ({ className = '', children }: { className?: string, children: ReactNode }) => (
  <span className={`badge badge-sm py-2 md:badge-lg ${className} flex gap-1`}>{children}</span>
)

export const LandButton = () => <span className="btn btn-circle btn-sm btn-outline"><i className="ms ms-land text-base" /></span>

export const CardsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-4 flex-wrap justify-center">{children}</div>
)