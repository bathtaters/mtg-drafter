import type { ReactNode } from 'react'
import { useTouchDevice } from '../libs/hooks'

export type Props = { label?: ReactNode, className?: string, labelClass?: string, menuClass?: string, forceOpen?: boolean | "click", children: ReactNode }

export default function DropdownMenu({
  label = '↓',
  className = 'dropdown-end',
  labelClass = 'btn-primary btn-circle btn-md md:w-12 text-lg',
  menuClass = 'p-2 shadow-lg shadow-black bg-base-100 rounded-box w-48 md:w-52',
  forceOpen, children
}: Props) {
  const isTouch = useTouchDevice()
  return (
    <div className={`dropdown ${className} ${
      forceOpen === true ? 'dropdown-open' : isTouch || forceOpen === 'click' || forceOpen === false ? '' : 'dropdown-hover'
    }`}>
      <label tabIndex={0} role="button" className={`btn ${labelClass}`}>
        {label}
      </label>

      <ul tabIndex={0} className={`dropdown-content menu text-base z-30 ${menuClass}${forceOpen === false ? ' hidden' : ''}`}>
        {children}
      </ul>
    </div>
  )
}