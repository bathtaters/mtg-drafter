import { ChangeEventHandler, ReactNode, useCallback, useEffect, useState } from "react"

export type Props = {
  label?: string,
  value: boolean,
  className?: string,
  children: [ReactNode, ReactNode],
  setValue: (val: boolean) => void
}


export default function IconToggle({ label, value, setValue, className = '', children }: Props) {
  const [ loadingState, setLoading ] = useState<boolean>()

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setLoading(ev.target.checked)
    setValue(ev.target.checked)
  }, [setValue])

  useEffect(() => setLoading(undefined), [value])

  return (
    <label data-tip={label} className={
      `swap${value ? ' swap-active' : ''}${label ? ' tooltip' : ''}${
        typeof loadingState === 'boolean' ? ' btn-disabled cursor-wait pointer-events-auto' : ''
      } tooltip-secondary inline-grid ${className}`
    }>
      <input type="checkbox" checked={value} onChange={handleChange} />
      <div className="swap-on">{children[0]}</div>
      <div className="swap-off">{children[1]}</div>
    </label>
  )
}