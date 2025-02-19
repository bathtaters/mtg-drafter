import type { ReactNode, ReactElement, HTMLProps } from "react"
import { Children } from "react"

export type Props<ID extends string|number> = {
  selected?: ID,
  setSelected: (key?: ID) => void,
  placeholder?: ReactNode,
  children: ReactElement<any>[],
  wrapperClass?: string,
} & Omit<HTMLProps<HTMLSelectElement>, 'children'|'selected'|'placeholder'>

const PLACEHOLDER = "__PLACEHOLDER__"

export default function Selector<ID extends string|number = number>({ label, selected, setSelected, placeholder, className, wrapperClass, children, ...props }: Props<ID>) {
  return (
    <div className={`${label ? 'tooltip' : ''} tooltip-secondary ${wrapperClass ?? ''}`} data-tip={label}>
      <select {...props}
        value={selected ?? PLACEHOLDER}
        onChange={(ev) => setSelected(ev.target.value === PLACEHOLDER ? undefined : ev.target.value as ID)}
        className={`select ${className || ''}${selected == null ? ' italic opacity-80' : ''}`}
      >
        {placeholder && <option value={PLACEHOLDER} disabled={true}>{placeholder}</option>}
        {Children.map(children, (child, idx) => <option key={child.key ?? idx} value={child.key ?? idx}>{child}</option>)}
      </select>
    </div>
  )
}