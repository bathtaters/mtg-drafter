import { ReactNode } from "react";
import { colorClass, colorPip } from "../../base/styles/manaIcons";

export function ColorsWrapper({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-5 gap-4">{children}</div>
}

export function ColorInputWrapper({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="input-group input-group-vertical">
      <label htmlFor={label+'Lands'} className={`text-center font-bold ms-3x py-2 ${colorPip[label]} ${colorClass[label]}`} aria-label={label.toUpperCase()}></label>
      {children}
    </div>
  )
}
