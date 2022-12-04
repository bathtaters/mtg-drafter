import type { Player } from "@prisma/client"
import { FullGame } from "assets/strings"
import { PlayerJoinContainer, PlayersWrapper, PlayerWrapper, PlayerButton } from "./PlayerJoinStyles"

type Props = { slots: Player['id'][], players: Player[], selectPlayer?: (id: Player['id']) => void }

export default function PlayerJoin({ slots, players, selectPlayer }: Props) {
  
  if (!slots.length) return <PlayerJoinContainer title="No Available Seats"><FullGame /></PlayerJoinContainer>

  const playerSlots = players.filter(({ id }) => slots.includes(id))

  return (
    <PlayerJoinContainer title="Pick a Seat:">
      <PlayersWrapper>
        { playerSlots.map(({ id, name }) => 
          <PlayerWrapper key={id}>
            <PlayerButton label={name} onClick={selectPlayer && (() => selectPlayer(id))} />
          </PlayerWrapper>
        )}
      </PlayersWrapper>
    </PlayerJoinContainer>
  )
}