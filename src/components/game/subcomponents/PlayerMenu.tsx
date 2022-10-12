import DropdownMenu from "components/base/common/DropdownMenu"

type Props = { saveDeck: (() => void) | null, openLands: (() => void) | null, openHost: (() => void) | null, dropPlayer: (() => void) | null }

export default function PlayerMenu({ saveDeck, openLands, openHost, dropPlayer }: Props) {
  return (
    <DropdownMenu label="☰">
      {!!saveDeck   && <li><a onClick={saveDeck  }>Export Deck</a></li> }
      {!!openLands  && <li><a onClick={openLands }>Set Lands</a></li>   }
      {!!openHost   && <li><a onClick={openHost  }>Host Tools</a></li>  }
      {!!dropPlayer && <li><a onClick={dropPlayer}>Drop Game</a></li>   }
    </DropdownMenu>
  )
}