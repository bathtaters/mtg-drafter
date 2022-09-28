import { useMemo, useState } from "react"

export default function RangeInput({ label, min, max, value, setValue, step = 1 }: {
  label: string, min: number, max: number, value?: string, setValue?: (value: string) => void, step?: number
}) {
  const length = useMemo(() => Math.round((max - min) / step + 1), [min, max, step])

  return (
    <div className="px-4 pb-4">
      <label className="label">
        <span className="label-text text-lg">{label}</span>
        <div className="label-text-alt text-sm w-6 py-1 border border-base-content bg-base-300 rounded-lg">
          <div className="w-full text-center">{value}</div>
        </div>
      </label>

      <input type="range" className="range range-secondary"
        min={min} max={max} step={step}
        value={setValue ? value : undefined}
        defaultValue={setValue ? undefined : value}
        onChange={setValue ? (ev) => setValue(ev.target.value) : undefined}
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span className="w-1 overflow-visible">{min}</span>
        {[...Array(length - 2)].map((_,idx) => <span key={idx}>|</span>)}
        <span className="w-1 overflow-visible">{max}</span>
      </div>
    </div>
  )
}

