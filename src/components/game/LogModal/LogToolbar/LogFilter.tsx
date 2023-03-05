import type { Dispatch, Key, ReactNode, SetStateAction } from "react"
import { useCallback } from "react"
import { FilterWrapper, FilterButton } from "./LogToolbarStyles"

type Props<ID> = {
  label: string,
  buttons: { id: ID, name?: string | null }[],
  baseList: ID[],
  offset?: number,
  invert?: boolean,
  hideAll?: boolean,
  selected?: ID[],
  setSelected: Dispatch<SetStateAction<ID[]>>
}

export default function LogFilter<ID extends Key = string>({ label, buttons, baseList, selected, setSelected, hideAll, invert, offset=0 }: Props<ID>) {
  const isAll = !hideAll && (!selected || selected.length === baseList.length)

  const updateSelection = useCallback((id: ID) =>
    (val: boolean) => setSelected((list) =>
      val ? (list || []).concat(id) : (list || baseList).filter((i) => i !== id)
    ),
  [baseList, setSelected])

  return (
    <FilterWrapper label={label}>
      {buttons.map(({ id, name }, idx) => 
        <FilterButton key={id}
          isSelected={!selected || selected.includes(id)} setSelected={updateSelection(id)}
          color={label ? idx + offset : -1} inverse={invert}
        >
          {name ?? String(id)}
        </FilterButton>
      )}
      {!hideAll &&
        <FilterButton isSelected={true} setSelected={() => setSelected(!isAll ? baseList : [])} wide={!(buttons.length % 2)}>
          {!isAll ? 'All' : 'None'}
        </FilterButton>
      }
    </FilterWrapper>
  )
}
