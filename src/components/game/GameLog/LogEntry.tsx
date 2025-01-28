import type { BasicPlayer, LogEntryFull } from "types/game"
import type { Dispatch, SetStateAction } from "react"
import CookieIcon from "components/svgs/CookieIcon"
import BotIcon from "components/svgs/BotIcon"
import { EntryWrapper, EntryItem, EntrySpace, MissingCard } from "./LogStyles"
import { allActions } from "./log.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"
import { BOT } from "assets/constants"

type Props = {
  entry: LogEntryFull,
  players: BasicPlayer[],
  isFirst?: boolean,
  isPrivate?: boolean,
  setCardImg: Dispatch<SetStateAction<string | null>>
}

export default function LogEntry({ entry, players, isFirst, isPrivate = false, setCardImg }: Props) {
  const { time, action, data, byHost, playerId, card, gameId } = entry
  
  const playerIdx = playerId ? players.findIndex(({ id }) => id === playerId) : -2
  const actionIdx = allActions.indexOf(action)

  return(
    <EntryWrapper>
      <EntryItem tip={logFullDate(time)} below={isFirst} right={true}>{logTimestamp(time)}</EntryItem>
      <EntrySpace />

      <EntryItem tip={playerId || gameId} below={isFirst} right={true} color={playerIdx} inv={true}>
        {playerIdx === -2 ? 'Game' : players[playerIdx]?.name || playerId}
      </EntryItem>
      <EntrySpace />

      <EntryItem tip={!isPrivate && card ? `${card.cardId} ${card.id}` : undefined} color={actionIdx} below={isFirst}>
        {formatLogAction(action, data, byHost)}
      </EntryItem>
      <EntrySpace />
      
      {!isPrivate && card && <EntryItem onClick={() => setCardImg(card.card.img)}>{card.card.name}</EntryItem>}
      {action === 'pick' && !card && <EntryItem><MissingCard /></EntryItem>}

      {action === 'join' && data && (
        <EntryItem tip={data === BOT ? 'Bot' : data} below={isFirst}>
          {data === BOT ? <BotIcon className="w-5" /> : <CookieIcon className="w-5 fill-current" />}
        </EntryItem>
      )}
      {action === 'rename' && data && <EntryItem>&quot;{data || ''}&quot;</EntryItem>}

      {action === 'pause' && data && <EntryItem><i className="text-sm mr-2">(after {data}s)</i></EntryItem>}

      {(action === 'rename' || action === 'join') && byHost && <EntrySpace />}

      {byHost && <EntryItem color={-1} inv={true}>by host</EntryItem>}
    </EntryWrapper>
  )

}