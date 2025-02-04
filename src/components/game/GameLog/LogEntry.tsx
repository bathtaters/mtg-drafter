import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer, GameCardPartial, LogEntryFull } from "types/game"
import type { GameLog } from "./log.controller"
import CookieIcon from "components/svgs/CookieIcon"
import BotIcon from "components/svgs/BotIcon"
import { EntryWrapper, EntryItem, EntrySpace, MissingCard, EntryLoading } from "./LogStyles"
import { IntersectionChildProps } from "components/base/libs/hooks"
import { allActions } from "./log.utils"
import { getBanName, getBanSession } from "../shared/player.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"
import { BOT } from "assets/constants"


function FullLogEntry({ entry, players, isFirst, isPrivate = false, setCard, childProps }: FullProps) {
  const { time, action, data, byHost, playerId, card, gameId } = entry
  
  const playerIdx = playerId ? players.findIndex(({ id }) => id === playerId) : -2
  const actionIdx = allActions.indexOf(action)

  return(
    <EntryWrapper childProps={childProps}>
      {/* Date */}
      <EntryItem tip={logFullDate(time)} below={isFirst} right={true}>{logTimestamp(time)}</EntryItem>
      <EntrySpace />

      {/* Player or Game */}
      <EntryItem tip={playerId || gameId} below={isFirst} right={true} color={playerIdx} inv={true}>{
        playerIdx !== -2 ? players[playerIdx]?.name || playerId :
        action === 'ban' || action === 'unban' ? getBanName(data) || 'Watcher' :
          'Game'
      }</EntryItem>
      <EntrySpace />

      {/* Main Action */}
      <EntryItem tip={!isPrivate && card ? `${card.cardId} ${card.id}` : undefined} color={actionIdx} below={isFirst}>
        {formatLogAction(action, data, byHost)}
      </EntryItem>
      <EntrySpace />
      
      {/* Card */}
      {!isPrivate && card && <EntryItem onClick={() => setCard(card)}>{card.card.name}</EntryItem>}
      {action === 'pick' && !card && <EntryItem><MissingCard /></EntryItem>}

      {/* Ban Cookie */}
      {(action === 'ban' || action === 'unban') && data && <>
        <EntryItem tip={getBanSession(data)} below={isFirst}>
          <CookieIcon className="w-5 fill-current" />
        </EntryItem>
        { byHost && <EntrySpace /> }
      </>}
      
      {/* Join Cookie or Bot */}
      {action === 'join' && data && (
        <EntryItem tip={data === BOT ? 'Bot' : data} below={isFirst}>
          {data === BOT ? <BotIcon className="w-5" /> : <CookieIcon className="w-5 fill-current" />}
        </EntryItem>
      )}

      {/* Additional Data */}
      {action === 'rename' && data && <EntryItem>&quot;{data || ''}&quot;</EntryItem>}

      {action === 'pause' && data && <EntryItem><i className="text-sm mr-2">(after {data}s)</i></EntryItem>}

      {(action === 'rename' || action === 'join') && byHost && <EntrySpace />}

      {/* By Host tag */}
      {byHost && <EntryItem color={-1} inv={true}>by host</EntryItem>}
    </EntryWrapper>
  )

}

const LogEntry = ({ log, index, getChildProps, preview, ...props }: Props) => (
  /* Not loaded entry */
  !log.entries[index] ? (!preview  ?
    <EntryLoading childProps={getChildProps?.(index)} /> :

  /* Preview entry */
    <FullLogEntry
      entry={preview}
      isFirst={log.loaded.first === index}
      isPrivate={log.options.hidePrivate}
      childProps={getChildProps?.(index)}
      {...props}
    />
  ) :

  /* Filtered out entry */
  !log.logFilter(log.entries[index]) ? null :

  /* Regular entry */
    <FullLogEntry
      entry={log.entries[index]}
      isFirst={log.loaded.first === index}
      isPrivate={log.options.hidePrivate}
      {...props}
    />
)

type FullProps = {
  entry: LogEntryFull,
  players: BasicPlayer[],
  isFirst?: boolean,
  isPrivate?: boolean,
  setCard: Dispatch<SetStateAction<GameCardPartial | null>>
  childProps?: IntersectionChildProps,
}

type Props = Pick<FullProps, 'players'|'setCard'> & {
  log: GameLog,
  preview?: LogEntryFull,
  index: number,
  getChildProps?: (index: number) => IntersectionChildProps
}

export default LogEntry