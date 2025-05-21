import { ExitIcon, ExportIcon, LandIcon, RenameIcon, ToolsIcon } from "components/svgs/MenuIcons"
import { Divider, DropdownMenuStyle, MenuItemStyle, NewGameIcon } from "./GameHeaderStyles"

type Props = {
  forceShow?: boolean,
  saveDeck?:   (() => void),
  openLands?:  (() => void),
  editName?:   (() => void) | false,
  openHost?:   (() => void),
  dropPlayer?: (() => void),
}

export default function GameMenu({ forceShow, saveDeck, openLands, editName, openHost, dropPlayer }: Props) {
  return (
    <DropdownMenuStyle forceOpen={forceShow}>
      <MenuItemStyle action="/"          label="New Game"   icon={<NewGameIcon />} />
      <MenuItemStyle action={openHost}   label="Host Tools" icon={<ToolsIcon   />} />
      <MenuItemStyle action={dropPlayer} label="Drop Game"  icon={<ExitIcon    />} /> 
      { (openLands || saveDeck || editName) && <Divider />}
      <MenuItemStyle action={editName  } label="Edit Name"   icon={<RenameIcon />} />
      <MenuItemStyle action={openLands } label="Set Lands"   icon={<LandIcon   />} />
      <MenuItemStyle action={saveDeck  } label="Export Deck" icon={<ExportIcon />} />
    </DropdownMenuStyle>
  )
}