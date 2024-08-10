import type { ReactNode } from 'react'
import { useTouchDevice } from '../libs/hooks'

type Props = { label?: ReactNode, labelClass?: string, menuClass?: string, forceOpen?: boolean | "click", children: ReactNode }

export default function DropdownMenu({
  label = '↓',
  labelClass = 'btn-primary btn-circle btn-md md:w-12 text-lg',
  menuClass = 'p-2 shadow-lg shadow-black bg-base-100 rounded-box w-48 md:w-52',
  forceOpen, children
}: Props) {
  const isTouch = useTouchDevice()
  return (
    <div className={`dropdown dropdown-end ${
      forceOpen === true ? 'dropdown-open' : isTouch || forceOpen === 'click' || forceOpen === false ? '' : 'dropdown-hover'
    }`}>
      <label tabIndex={0} role="button" className={`btn ${labelClass}`}>
        {label}
      </label>

      <ul className={`dropdown-content menu text-base z-20 ${menuClass}${forceOpen === false ? ' hidden' : ''}`}>
        {children}
      </ul>
    </div>
  )
}