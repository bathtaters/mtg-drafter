import type { ReactNode } from "react";

type Props = { label?: ReactNode, labelClass?: string, menuClass?: string, forceOpen?: boolean | "click", children: ReactNode }

export default function DropdownMenu({
  label = '↓',
  labelClass = 'btn-primary btn-circle btn-md md:w-12 text-lg',
  menuClass = 'p-2 shadow-lg shadow-black bg-base-100 rounded-box w-48 md:w-52',
  forceOpen, children
}: Props) {
  return (
    <div className={`dropdown dropdown-end ${forceOpen === 'click' ? '' : typeof forceOpen !== 'boolean' ? 'dropdown-hover' : forceOpen ? 'dropdown-open' : ''}`}>
      <label tabIndex={0} className={`btn ${labelClass}`}>
        {label}
      </label>

      <ul tabIndex={0} className={`dropdown-content menu ${menuClass}${forceOpen === false ? ' hidden' : ''}`}>
        {children}
      </ul>
    </div>
  )
}