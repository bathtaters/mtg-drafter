import DropdownMenu from "components/base/common/DropdownMenu"
import { MenuItemStyle } from "./PlayerContainerElemStyles"

type Props = {
  saveDeck?:   (() => void),
  openLands?:  (() => void),
  editName?:   (() => void),
  openHost?:   (() => void),
  dropPlayer?: (() => void),
}

export default function PlayerMenu({ saveDeck, openLands, editName, openHost, dropPlayer }: Props) {
  return (
    <DropdownMenu label="☰">
      {!!saveDeck   && <li><a onClick={saveDeck  }><MenuItemStyle label="Export Deck" /></a></li> }
      {!!openLands  && <li><a onClick={openLands }><MenuItemStyle label="Set Lands"   /></a></li> }
      {<li className={editName ? "" : "disabled"}><a onClick={editName}><MenuItemStyle label="Edit Name" /></a></li> }
      {!!openHost   && <li><a onClick={openHost  }><MenuItemStyle label="Host Tools"  /></a></li> }
      {!!dropPlayer && <li><a onClick={dropPlayer}><MenuItemStyle label="Drop Game"   /></a></li> }
    </DropdownMenu>
  )
}