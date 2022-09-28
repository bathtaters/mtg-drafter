import { useState } from "react";
import { Player } from "../../../models/Game";
import DropdownWrapper from "../../base/common/DropdownMenu";
import HostModal from "./HostModal";
import LandsModal from "./LandsModal";


export default function PlayerMenu({ player, isHost }: { player: Player, isHost: boolean }) {
  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)

  const handleLandsSubmit = (newLands: {}) => { console.log(newLands) } // Submit lands to server

  return (<>
    <DropdownWrapper label="↓">
      <li><a>Export Deck</a></li>
      <li><a onClick={() => setLandModal((st) => !st)}>Add Lands</a></li>
      {isHost && <li><a onClick={() => setHostModal((st) => !st)}>Host Tools</a></li>}
    </DropdownWrapper>

    <LandsModal basicLands={player.basicLands} isOpen={landModal} setOpen={setLandModal} onSubmit={handleLandsSubmit} />

    {isHost && <HostModal isOpen={hostModal} setOpen={setHostModal} />}
  </>)
}