import type { ReactNode } from "react"

export type Props = {
  label: string,
  selected: number,
  setSelected: (index: number) => void,
  className?: string,
  children: ReactNode[],
}

export default function Selector({ label, selected, setSelected, className, children }: Props) {
  return (
    <div className={`${label ? 'tooltip' : ''} tooltip-secondary`} data-tip={label}>
      <select className={`select ${className || ''}`} value={selected} onChange={(ev) => setSelected(+ev.target.value)}>
        {children.map((child, idx) => <option value={idx}>{child}</option>)}
      </select>
    </div>
  )
}