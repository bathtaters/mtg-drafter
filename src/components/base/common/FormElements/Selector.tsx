import { ReactNode, Children, ReactElement, Component } from "react"

export type Props<ID extends string|number> = {
  label?: string,
  selected: ID,
  setSelected: (key: string) => void,
  className?: string,
  children: ReactElement[],
}

export default function Selector<ID extends string|number = number>({ label, selected, setSelected, className, children }: Props<ID>) {
  return (
    <div className={`${label ? 'tooltip' : ''} tooltip-secondary`} data-tip={label}>
      <select className={`select ${className || ''}`} value={selected} onChange={(ev) => setSelected(ev.target.value)}>
        {Children.map(children, (child, idx) => <option key={child.key ?? idx} value={child.key ?? idx}>{child}</option>)}
      </select>
    </div>
  )
}