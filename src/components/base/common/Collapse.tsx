import type { ReactNode } from "react";

type Props = {
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