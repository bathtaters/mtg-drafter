import type { ReactNode, HTMLProps } from "react"

type Value = HTMLProps<HTMLInputElement>['value']
type ContainerProps = {
  caption?: ReactNode,
  value: Value,
  boxClass?: string,
  tooltip?: string,
  className?: string,
  children: ReactNode,
}

const MARKER_CHAR = '|'

export const RangeContainer = ({ caption, value, tooltip, boxClass, className, children }: ContainerProps) => (
  <div className={`${className || "px-4 pb-4 w-full"}${tooltip ? ' tooltip tooltip-secondary' : ''}`} data-tip={tooltip}>
    {caption &&
      <label className="label">
        <span className="label-text text-lg">{caption}</span>
        <RangeValueBox value={value} className={boxClass} />
      </label>
    }
    {children}
  </div>
)

export const RangeValueBox = ({ value, className = 'w-6' }: { value: Value, className?: string }) => (
  <div className={`label-text-alt text-sm ${className} py-1 border border-base-content bg-base-300 rounded-lg`}>
    <div className="w-full text-center">{value || '-'}</div>
  </div>
)

export const RangeInputElem = (props: HTMLProps<HTMLInputElement>) => (
  <input className="range range-sm md:range-md range-secondary" {...props} type="range" />
)

export function RangeStepMarkers({ first, last, count }: { first?: string | number, last?: string | number, count: number }) {
  return (
    <div className="w-full flex justify-between text-xs px-2">
      <span className="w-1 overflow-visible">{first ?? MARKER_CHAR}</span>
      {count > 2 && [...Array(count - 2)].map((_,idx) => <span key={idx}>{MARKER_CHAR}</span>)}
      <span className="w-1 overflow-visible">{last ?? MARKER_CHAR}</span>
    </div>
  )
}