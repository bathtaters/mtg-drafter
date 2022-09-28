import { ReactNode } from "react";

const colorClass: { [key: string]: string } = {
  w: "text-amber-900 bg-yellow-100",
  u: "text-blue-800 bg-indigo-400",
  b: "text-gray-400 bg-slate-800",
  r: "text-orange-900 bg-red-400",
  g: "text-green-800 bg-emerald-400",
}

export function ColorsWrapper({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-5">{children}</div>
}

export function ColorInputWrapper({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="input-group input-group-vertical">
      <label htmlFor={label+'Lands'} className={"text-center font-bold text-xl "+colorClass[label]}>{label.toUpperCase()}</label>
      {children}
    </div>
  )
}
