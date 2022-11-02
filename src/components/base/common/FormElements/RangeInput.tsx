import type { HTMLProps } from "react"
import { useMemo } from "react"
import { RangeContainer, RangeInputElem, RangeStepMarkers } from "./styles/RangeInputStyles"

const rangeValueError = (min: any, max: any, step: any) => new Error(
  `RangeInput requires numeric value for min(${min})/max(${max})/step(${step})`
)

export type Props = HTMLProps<HTMLInputElement> & { 
  wrapperClass?: string,
  setValue?: (value: string) => void,
}

export default function RangeInput({ label, value, setValue, min = 0, max = 100, step = 1, wrapperClass, ...props }: Props) {

  const length = useMemo(() => Math.round((+max - +min) / +step + 1), [min, max, step])
  if (isNaN(length)) throw rangeValueError(min, max, step)

  return (
    <RangeContainer className={wrapperClass} label={label} value={value} tooltip={props['aria-label']}>

      <RangeInputElem
        min={min} max={max} step={step}
        value={setValue ? value : undefined}
        defaultValue={setValue ? undefined : value}
        onChange={setValue ? (ev) => setValue(ev.currentTarget.value) : undefined}
        {...props}
      />

      {label && <RangeStepMarkers first={label && min} last={label && max} count={length}  />}
    </RangeContainer>
  )
}
