import type { HTMLProps, ReactNode } from "react"
import { useMemo } from "react"
import { RangeContainer, RangeInputElem, RangeStepMarkers } from "./styles/RangeInputStyles"

const rangeValueError = (min: any, max: any, step: any) => new Error(
  `RangeInput requires numeric value for min(${min})/max(${max})/step(${step})`
)

export type Props = HTMLProps<HTMLInputElement> & {
  keys?: string[],
  caption?: ReactNode,
  wrapperClass?: string,
  boxClass?: string,
  setValue?: (value: string) => void,
}

export default function RangeInput({ caption, value, keys, setValue, min = 0, max = 100, step = 1, wrapperClass, boxClass, ...props }: Props) {

  const length = useMemo(() => Math.round((+max - +min) / +step + 1), [min, max, step])
  if (isNaN(length)) throw rangeValueError(min, max, step)

  return (
    <RangeContainer
      caption={caption} value={keys && value && +value in keys ? keys[+value] : value}
      className={wrapperClass} boxClass={boxClass} tooltip={props['aria-label']}
    >

      <RangeInputElem
        min={min} max={max} step={step}
        value={setValue ? value : undefined}
        defaultValue={setValue ? undefined : value}
        onChange={setValue ? (ev) => setValue(ev.currentTarget.value) : undefined}
        {...props}
      />

      {caption && <RangeStepMarkers first={keys ? undefined : min} last={keys ? undefined : max} count={length}  />}
    </RangeContainer>
  )
}

