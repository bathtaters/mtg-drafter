import Link from "next/link"
import { ExitIcon, ExportIcon, LandIcon, RenameIcon, ToolsIcon } from "components/svgs/MenuIcons"
import { Divider, DropdownMenuStyle, MenuItemStyle, NewGameIcon } from "./GameHeaderStyles"
import LogoIcon from "components/svgs/LogoIcon"

type Props = {
  forceShow?: boolean,
  saveDeck?:   (() => void),
  openLands?:  (() => void),
  editName?:   (() => void),
  openHost?:   (() => void),
  dropPlayer?: (() => void),
}

export default function GameMenu({ forceShow, saveDeck, openLands, editName, openHost, dropPlayer }: Props) {
  return (
    <DropdownMenuStyle forceOpen={forceShow}>
      <MenuItemStyle action={openHost}   label="Host Tools" icon={<ToolsIcon   />} />
      <MenuItemStyle action={dropPlayer} label="Drop Game"  icon={<ExitIcon    />} /> 
      <Divider />
      <MenuItemStyle action={editName ?? false} label="Edit Name"   icon={<RenameIcon />} />
      <MenuItemStyle action={openLands }        label="Set Lands"   icon={<LandIcon   />} />
      <MenuItemStyle action={saveDeck  }        label="Export Deck" icon={<ExportIcon />} />
    </DropdownMenuStyle>
  )
}