import type { ReactNode } from "react"

export type Props = {
  label?: ReactNode,
  value: boolean,
  wrapperClass?: string,
  className?: string,
  setValue: (val: boolean) => void
}

export default function ToggleSwitch({ label, value, setValue, wrapperClass = 'px-4 pb-4 w-full', className = 'toggle-secondary' }: Props) {
  return (
    <label className={`label cursor-pointer ${wrapperClass}`}>
      <span className="label-text text-base">{label}</span>
      <input type="checkbox" className={`toggle ${className}`} checked={value} onChange={(ev) => setValue(ev.target.checked)} />
    </label>
  )
}
