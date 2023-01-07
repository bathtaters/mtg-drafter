import type { ReactNode, MouseEventHandler } from "react"

export default function Tabs<Tab extends string|number>({ tabs, selected, setSelected, className = '', tabClass = '' }: Props<Tab>) {
  return (
    <TabWrapper className={className}>
      {tabs.map((tab) =>
        <Tab key={tab} selected={tab === selected} onClick={() => setSelected(tab)} className={tabClass}>{tab}</Tab>
      )}
    </TabWrapper>
  )
}

// PROPS

export type Props<T extends string|number> = {
  tabs: readonly T[],
  selected: T,
  setSelected: (value: T) => void
  className?: string,
  tabClass?: string,
}

// STYLES

const TabWrapper = ({ className, children }: { className: string, children: ReactNode }) => (
  <div className={`tabs ${className}`}>{children}</div>
)

const Tab = ({ selected, onClick, children, className }: { selected?: boolean, onClick?: MouseEventHandler, className: string, children: ReactNode }) => (
  <a className={`tab ${selected ? 'tab-active ' : ''}${className}`} onClick={onClick}>{children}</a>
)
