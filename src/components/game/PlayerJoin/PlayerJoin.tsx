import type { BasicPlayer, Game } from "types/game"
import { FullGame } from "assets/strings"
import { PlayerJoinContainer, PlayersWrapper, PlayerWrapper, PlayerButton } from "./PlayerJoinStyles"

type Props = { slots: BasicPlayer['id'][], players: BasicPlayer[], selectPlayer?: (id: BasicPlayer['id']) => void, game?: Partial<Game> }

export default function PlayerJoin({ slots, players, selectPlayer, game }: Props) {

  const isLocked = game?.banned && game.banned.some(({ gameId, sessionId }) => !sessionId && gameId === game.id)
  
  if (isLocked) return <PlayerJoinContainer title="This Game has been locked by the host"><FullGame /></PlayerJoinContainer>

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