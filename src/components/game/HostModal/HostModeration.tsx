import type { ReactNode } from "react"
import type { Game, BasicPlayer, BasicWatcher } from "types/game"
import { PlayerWrapper, PlayerButton, PlayersWrapper, BanNameWrapper, NoPlayers } from "./HostModalStyles"
import { BOT } from "assets/constants"


export type Props = {
  label?: string,
  players: BasicPlayer[] | BasicWatcher[],
  banned?: Game['banned'],
  kickOne: (playerId: string) => void,
  banOne: (sessionId?: string | null, unban?: boolean, playerId?: string) => void,
  children?: ReactNode,
}
  
export default function Moderation({ label, players, banned, kickOne, banOne, children }: Props) {
  if (!players.length) return <NoPlayers>No players found</NoPlayers>

  return (<>
    <PlayersWrapper label={label}>
      {players.map((player) => 'id' in player ?
        // Game Player
        <ModerationEntry key={player.id}
          id={player.sessionId} name={player.name}
          kick={() => kickOne(player.id)}
          ban={() => banOne(player.sessionId, false, player.id)}
        />
        :
        // Game Watcher
        <ModerationEntry key={player.sessionId}
          id={player.sessionId} name={player.name}
          kick={() => kickOne(player.sessionId)}
          ban={() => banOne(player.sessionId)}
        />
      )}
    </PlayersWrapper>
    
    {children}

    { banned &&
      <PlayersWrapper label="Ban List">
        {banned.map(({ id, sessionId, name, note }) => 
          <ModerationEntry key={id} id={sessionId} name={name} note={note}
            unban={() => banOne(sessionId, true)}
          />
        )}
      </PlayersWrapper>
    }
  </>)
}


function ModerationEntry({ id, name, note, kick, ban, unban }: EntryProps) {
  if (!id) return null
  return (
    <PlayerWrapper>
      <BanNameWrapper id={id || undefined} isBanned={!!unban} tooltip={note || undefined}>{name}</BanNameWrapper>
      { kick && <PlayerButton icon="kick" tooltip="Kick" action={kick} /> }
      { ban && id !== BOT && <PlayerButton icon="ban" tooltip="Ban" action={ban} /> }
      { unban && <PlayerButton icon="unban" tooltip="Unban" action={unban} />}
    </PlayerWrapper>
  )
}

type EntryProps = {
  id?: string | null,
  name?: string | null,
  note?: string | null,
  kick?: () => void,
  ban?: () => void,
  unban?: () => void,
}