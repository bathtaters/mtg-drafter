import { ReactNode } from "react";

export default function DropdownMenu({
  label = '↓',
  labelClass = 'btn-primary btn-circle btn-sm sm:btn-md sm:w-12 sm:text-lg',
  menuClass = 'p-2 shadow-lg shadow-black bg-base-100 rounded-box w-52',
  children
}:{
  label?: ReactNode, labelClass?: string, menuClass?: string, children: ReactNode
}) {
  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <label tabIndex={0} className={`btn ${labelClass}`}>
        {label}
      </label>

      <ul tabIndex={0} className={`dropdown-content menu ${menuClass}`}>
        {children}
      </ul>
    </div>
  )
}