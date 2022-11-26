import DropdownMenu from "components/base/common/DropdownMenu"
import { ExitIcon, ExportIcon, LandIcon, RenameIcon, ToolsIcon } from "components/svgs/MenuIcons"
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
      {!!saveDeck   && <li><a onClick={saveDeck  }><MenuItemStyle label="Export Deck" icon={<ExportIcon />} /></a></li> }
      {!!openLands  && <li><a onClick={openLands }><MenuItemStyle label="Set Lands"   icon={<LandIcon   />} /></a></li> }
      {<li className={editName ? "" : "disabled"}>
        <a onClick={editName}><MenuItemStyle label="Edit Name" icon={<RenameIcon />} /></a>
      </li> }
      {!!openHost   && <li><a onClick={openHost  }><MenuItemStyle label="Host Tools"  icon={<ToolsIcon  />} /></a></li> }
      {!!dropPlayer && <li><a onClick={dropPlayer}><MenuItemStyle label="Drop Game"   icon={<ExitIcon   />} /></a></li> }
    </DropdownMenu>
  )
}