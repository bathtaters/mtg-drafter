import type { ReactNode } from "react"

export type Props = {
  label?: string,
  value: boolean,
  className?: string,
  children: [ReactNode, ReactNode],
  setValue: (val: boolean) => void
}


export default function IconToggle({ label, value, setValue, className = '', children }: Props) {
  return (
    <label data-tip={label} className={
      `swap${value ? ' swap-active' : ''}${label ? ' tooltip' : ''} tooltip-secondary inline-grid ${className}`
    }>
      <input type="checkbox" checked={value} onChange={(ev) => setValue(ev.target.checked)} />
      <div className="swap-on">{children[0]}</div>
      <div className="swap-off">{children[1]}</div>
    </label>
  )
}