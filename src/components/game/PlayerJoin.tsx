import type { Player } from "@prisma/client"
import { PlayerJoinContainer, PlayersWrapper, PlayerWrapper, PlayerButton } from "./styles/PlayerJoinStyles"

type Props = { slots: Player['id'][], players: Player[], selectPlayer?: (id: Player['id']) => void }

export default function PlayerJoin({ slots, players, selectPlayer }: Props) {
  const playerSlots = players.filter(({ id }) => slots.includes(id))

  return (
    <PlayerJoinContainer title="Pick a Spot:">
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