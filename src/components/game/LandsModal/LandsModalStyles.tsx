import type { ReactNode, HTMLProps } from "react"
import type { Color } from "@prisma/client"
import { colorClass, colorPip } from "components/base/styles/manaIcons"
import NumberInput from "components/base/common/FormElements/NumberInput"

export function ColorsWrapper({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-5 md:grid-cols-7 gap-4">{children}</div>
}

export function ColorInputWrapper({ label, children }: { label: Lowercase<Color>, children: ReactNode }) {
  return (
    <div className="join join-vertical">
      <label className={`join-item text-center ms-3x py-1.5 h-12 ${colorPip[label]} ${colorClass[label]}`} aria-label={label.toUpperCase()} />
      {children}
    </div>
  )
}

export const ColorLabels = ({ labels, className }: { labels: ReactNode[], className: string }) => (
  <div className={`join join-vertical ${className} hidden md:flex`}>
    { labels.map((label, idx) => <div className="h-12 flex items-center" key={idx}>{label}</div>) }
  </div>
)

export const ColorInput = ({ label, value, setValue }: { label: Lowercase<Color>, value: number, setValue: (value: number) => void}) => (
  <NumberInput
    className={`input join-item border-t border-t-base-300/30 ${colorClass[label]} text-sm md:text-xl h-12 hide-arrows md:show-arrows`}
    value={value} min="0"
    onChange={(ev) => setValue(+ev.currentTarget.value)}
  />
)

export const AutoLandsInput = ({ label, ...props }: HTMLProps<HTMLInputElement>) => (
  <>
    <span className=" text-primary px-0 mr-2 justify-self-end">
      {label}
    </span>
    <NumberInput {...props}
      className="input bg-[color-mix(in_oklab,oklch(var(--b1)),white_10%)]
      w-full h-full py-1 px-2 text-sm md:text-base hide-arrows md:show-arrows"
    />
  </>
)

export const AutoLandsWrapper = ({ button, children }: { button: ReactNode, children: ReactNode }) => (
  <div className="join mr-auto">
    {button}
    <details className="dropdown join-item">
      <summary className="btn btn-primary rounded-l-none text-2xl py-1 px-2">▸</summary>
      <div
        className="dropdown-content bg-base-300 text-base-content
        w-44 sm:w-52 p-2 sm:p-3 left-full bottom-0
        border-2 border-primary/70 rounded-md shadow-md shadow-black
        grid grid-cols-2 items-center gap-y-2 sm:gap-y-4"
      >
        {children}
      </div>
    </details>
  </div>
)
