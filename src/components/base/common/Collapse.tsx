import { ReactNode } from "react";

export default function CollapseContainer({ title, defaultOpen, children, className = '', titleClass = 'text-xl font-medium'  }: {
  title: ReactNode, defaultOpen: boolean, children: ReactNode
  className?: string, titleClass?: string,
}) {
  return (
    <div className={`collapse collapse-arrow ${className}`}>
      <input type="checkbox" defaultChecked={defaultOpen} /> 
      <div className={`collapse-title ${titleClass}`}>{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  )
}