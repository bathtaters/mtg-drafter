import type { Player } from "@prisma/client"
import type { LogFull } from "types/game"
import CookieIcon from "components/svgs/CookieIcon"
import { EntryWrapper, EntryItem, EntrySpace } from "./LogModalStyles"
import { actionBase } from "./log.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"


export default function LogEntry({ entry, players, isFirst, isPrivate = false }: { entry: LogFull[number], players: Player[], isFirst?: boolean, isPrivate?: boolean }) {
  const { time, action, data, byHost, playerId, card, gameId } = entry
  
  const playerIdx = playerId ? players.findIndex(({ id }) => id === playerId) : -2
  const actionIdx = actionBase.indexOf(action)

  return(
    <EntryWrapper>
      <EntryItem tip={logFullDate(time)} below={isFirst} right={true}>{logTimestamp(time)}</EntryItem>
      <EntrySpace />

      <EntryItem tip={playerId || gameId} below={isFirst} right={true} color={playerIdx} inv={true}>
        {playerIdx === -2 ? 'Game' : players[playerIdx]?.name || playerId}
      </EntryItem>
      <EntrySpace />

      <EntryItem color={actionIdx}>{formatLogAction(action, data, byHost)}</EntryItem>
      <EntrySpace />
      
      {!isPrivate && card && <EntryItem tip={`${card.cardId} ${card.id}`} below={isFirst}>&quot;{card.card.name}&quot;</EntryItem>}

      {action === 'join' && data && <EntryItem tip={data || 'N/A'} below={isFirst}><CookieIcon className="w-5 fill-current" /></EntryItem>}
      {action === 'rename' && data && <EntryItem>&quot;{data || ''}&quot;</EntryItem>}

      {(action === 'rename' || action === 'join') && byHost && <EntrySpace />}

      {byHost && <EntryItem color={-1} inv={true}>by host</EntryItem>}
    </EntryWrapper>
  )

}