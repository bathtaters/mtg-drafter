import { ReactNode, useState } from "react";

export type Props = {
  button: ReactNode,
  defaultOpen: boolean,
  children: ReactNode
  className?: string,
  buttonClass?: string,
}

export default function CollapseContainer({ button, defaultOpen, children, className = '', buttonClass = 'text-xl font-medium'  }: Props) {
  const [ open, setOpen ] = useState(defaultOpen)

  return (<>
    <button type="button" className={`btn z-10 ${buttonClass}`} onClick={() => setOpen((o) => !o)}>{button}</button>
    <div className={`collapse ${className} ${open ? 'collapse-open' : 'collapse-close'} z-0`}>
      <div className="collapse-content relative overflow-visible">{children}</div>
    </div>
  </>)
}


export function HorizontalCollapse({ button, defaultOpen, children, className = '', buttonClass = '' }: Props) {
  const [ open, setOpen ] = useState(defaultOpen)

  return (
    <div className="flex justify-end items-top">
      <span className={`flex-grow transition-transform origin-top-right ${className} ${open ? "mb-4" : "scale-x-0"}`}>{children}</span>
      <a className={`btn flex-shrink flex-grow-0 ${buttonClass}`} onClick={() => setOpen((o) => !o)}>{button}</a>
    </div>
  )
}