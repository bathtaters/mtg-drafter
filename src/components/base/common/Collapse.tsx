import { ReactNode, useState } from "react";

export type Props = {
  title: ReactNode,
  defaultOpen: boolean,
  children: ReactNode
  className?: string,
  titleClass?: string,
}

export default function CollapseContainer({ title, defaultOpen, children, className = '', titleClass = 'text-xl font-medium'  }: Props) {
  return (
    <div className={`collapse collapse-arrow ${className}`}>
      <input type="checkbox" defaultChecked={defaultOpen} /> 
      <div className={`collapse-title text-left ${titleClass}`}>{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  )
}


export function HorizontalCollapse({ title, defaultOpen, children, className = '', titleClass = '' }: Props) {
  const [ open, setOpen ] = useState(defaultOpen)

  return (
    <div className="flex justify-end items-top">
      <span className={`flex-grow transition-transform origin-top-right ${className} ${open ? "mb-4" : "scale-x-0"}`}>{children}</span>
      <a className={`btn flex-shrink flex-grow-0 ${titleClass}`} onClick={() => setOpen((o) => !o)}>{title}</a>
    </div>
  )
}