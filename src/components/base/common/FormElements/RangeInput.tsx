import type { HTMLProps, ReactNode } from "react"
import { useMemo } from "react"
import { RangeContainer, RangeInputElem, RangeStepMarkers } from "./styles/RangeInputStyles"

const rangeValueError = (min: any, max: any, step: any) => new Error(
  `RangeInput requires numeric value for min(${min})/max(${max})/step(${step})`
)

export type Props = HTMLProps<HTMLInputElement> & {
  keys?: string[] | Record<"value"|"tooltip",string>[],
  caption?: ReactNode,
  wrapperClass?: string,
  boxClass?: string,
  captionClass?: string,
  setValue?: (value: string) => void,
}

export default function RangeInput({ caption, value, keys, setValue, min = 0, max = 100, step = 1, wrapperClass, boxClass, captionClass, ...props }: Props) {

  const length = useMemo(() => Math.round((+max - +min) / +step + 1), [min, max, step])
  if (isNaN(length)) throw rangeValueError(min, max, step)

  const key = keys && value != null && +value in keys ? keys[+value] : value as string | number | undefined

  return (
    <RangeContainer
      caption={caption}
      value={typeof key === 'object' ? key.value : key}
      tooltip={`${props['aria-label'] || ''}${typeof key === 'object' ? key.tooltip || key.value : ''}`}
      className={wrapperClass} boxClass={boxClass} captionClass={captionClass}
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

