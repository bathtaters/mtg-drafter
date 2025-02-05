import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer, GameCardPartial, LogEntryFull } from "types/game"
import CookieIcon from "components/svgs/CookieIcon"
import BotIcon from "components/svgs/BotIcon"
import { EntryWrapper, EntryItem, EntrySpace, MissingCard, EntryLoading } from "./LogStyles"
import { IntersectionChildProps } from "components/base/libs/hooks"
import { getBanName, getBanSession } from "../shared/player.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"
import { BOT } from "assets/constants"
import { allActions } from "types/logs"


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


const LogEntry = ({ index, isLoading, ...props }: Props) => (
  /* Not loaded entry */
  !props.entry ?
    <EntryLoading childProps={props.childProps} /> :

  /* Preview entry */
  isLoading ?
    <FullLogEntry {...props as FullProps} /> :

  /* Regular entry */
  <FullLogEntry {...props as FullProps} />  
)


export default LogEntry


type FullProps = {
  entry: LogEntryFull,
  players: BasicPlayer[],
  isFirst?: boolean,
  isPrivate?: boolean,
  setCard: Dispatch<SetStateAction<GameCardPartial | null>>
  childProps?: IntersectionChildProps,
}

type Props = Omit<FullProps, 'entry'> & {
  index: number,
  isLoading: boolean,
  entry?: FullProps['entry'],
}