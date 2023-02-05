import type { CSSProperties } from "react"

type Props = { value?: number, maxValue?: number, label?: string, className?: string }

export default function RadialProgress({ value = 0, maxValue, label = '', className = '' }: Props) {

    if (maxValue === 0 || value < 0 || (maxValue ? value > maxValue : value > 100)) return (
        <div className={`radial-progress ${className} animate-spin`} style={{ "--value": 75 } as CSSProperties} />
    )
  
    const percent = maxValue ? Math.round(100 * value / maxValue) : value
    return (
        <div className={`radial-progress ${className}`} style={{ "--value": percent } as CSSProperties}>
            {typeof maxValue === 'number' ? `${value}/${maxValue} ${label}` : `${value}% ${label}`}
        </div>
    )
}