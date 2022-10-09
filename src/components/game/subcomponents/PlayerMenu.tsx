import DropdownWrapper from "components/base/common/DropdownMenu"

type Props = { openLands: (() => void) | null, openHost: (() => void) | null }

export default function PlayerMenu({ openLands, openHost }: Props) {
  return (<>
    <DropdownWrapper label="↓">
      <li><a>Export Deck</a></li>
      {!!openLands && <li><a onClick={openLands}>Set Lands</a></li> }
      {!!openHost  && <li><a onClick={openHost }>Host Tools</a></li>}
    </DropdownWrapper>
  </>)
}