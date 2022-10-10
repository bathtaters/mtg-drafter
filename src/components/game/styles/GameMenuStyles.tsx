import type { ReactNode, MouseEventHandler, HTMLProps } from "react"
import { colorClass, colorPip } from "components/base/styles/manaIcons"

export const ModalButton = ({ onClick, className = '', children }: { onClick: MouseEventHandler, className?: string, children: ReactNode }) => (
  <button type="button" className={`btn ${className}`} onClick={onClick}>{children}</button>
)

export function ColorsWrapper({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-5 md:grid-cols-7 gap-4">{children}</div>
}

export function ColorInputWrapper({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="input-group input-group-vertical">
      <label className={`text-center ms-3x py-1.5 h-12 ${colorPip[label]} ${colorClass[label]}`} aria-label={label.toUpperCase()} />
      {children}
    </div>
  )
}

export const ColorLabels = ({ labels, className }: { labels: ReactNode[], className: string }) => (
  <div className={`input-group input-group-vertical ${className} hidden md:block`}>
    { labels.map((label, idx) => <div className="h-12 flex items-center" key={idx}>{label}</div>) }
  </div>
)

export const ColorInput = ({ value, setValue }: { value: number, setValue?: (value: number) => void}) => (
  <input
    className="input input-bordered text-base md:text-xl h-12"
    type="number" min={0} pattern="[0-9]+"
    defaultValue={setValue ? undefined : value}
    value={setValue && value}
    onChange={setValue && ((ev) => setValue(+ev.target.value))}
  />
)

export const AutoLandsInput = ({ label, ...props }: HTMLProps<HTMLInputElement>) => (
  <div className="w-12 md:w-16 tooltip tooltip-accent tooltip-top input input-bordered input-accent p-0 overflow-hidden" data-tip={label}>
    <input {...props} type="number" pattern="[0-9]+"
      className="input bg-accent-content text-accent w-full h-full p-1 !rounded-none
      text-center text-sm md:text-base"
    />
  </div>
)

export const AutoLandsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="input-group mr-auto">{children}</div>
)
