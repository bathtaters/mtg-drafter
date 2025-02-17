import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer, Game, GameCardPartial, LogEntryFull } from "types/game"
import CookieIcon from "components/svgs/CookieIcon"
import BotIcon from "components/svgs/BotIcon"
import GearIcon from "components/svgs/GearIcon"
import WatcherIcon from "components/svgs/WatcherIcon"
import { EntryWrapper, EntryItem, EntrySpace, MissingCard, EntryLoading } from "./LogStyles"
import { IntersectionChildProps } from "components/base/libs/hooks"
import { getSession } from "./log.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"
import { ALL_WATCHERS, BOT } from "assets/constants"
import { allActions } from "types/logs"


function FullLogEntry({ entry, players, isFirst, isPrivate = false, setCard, childProps }: FullProps) {
  const { time, action, data, byHost, playerId, card, gameId } = entry
  
  const playerIdx = playerId ? players.findIndex(({ id }) => id === playerId) : -2
  const actionIdx = allActions.indexOf(action)
  
  const session = getSession(entry)
  const isWatcher = !!session?.id && playerIdx === -2

  const gameData: Partial<Game> | undefined = action === 'settings' ? data && JSON.parse(data) : undefined

  return(
    <EntryWrapper childProps={childProps}>
      {/* Date */}
      <EntryItem tip={logFullDate(time)} below={isFirst} right={true}>{logTimestamp(time)}</EntryItem>
      <EntrySpace />

      {/* Watcher */}
      {isWatcher && <>
        <EntryItem tip={session.id === ALL_WATCHERS ? "All watchers" : "Watcher"} below={isFirst}>
          <WatcherIcon className="w-5 fill-current" />
        </EntryItem>
        <EntrySpace />
      </>}

      {/* Player or Game */}
      {session?.id !== ALL_WATCHERS && <>
        <EntryItem tip={playerId || gameId} below={isFirst} right={true} color={playerIdx} inv={true}>{
          session?.name ? session.name : // Session name
          playerIdx !== -2 ? players[playerIdx]?.name || playerId : // Player name
          session?.id ? 'Watcher' : 'Game' // Generic entry
        }</EntryItem>
        <EntrySpace />
      </>}

      {/* Main Action */}
      <EntryItem tip={!isPrivate && card ? `${card.cardId} ${card.id}` : undefined} color={actionIdx} below={isFirst}>
        {formatLogAction(action, data, byHost, gameData)}
      </EntryItem>
      <EntrySpace />
      
      {/* Card */}
      {!isPrivate && card && <EntryItem onClick={() => setCard(card)}>{card.card.name}</EntryItem>}
      {action === 'pick' && !card && <EntryItem><MissingCard /></EntryItem>}

      {/* Ban Cookie */}
      {session?.id && session.id !== ALL_WATCHERS && <>
        <EntryItem tip={session.id} below={isFirst}>
          <CookieIcon className="w-5 fill-current" />
        </EntryItem>
        { byHost && <EntrySpace /> }
      </>}
      
      {/* Bot */}
      {action === 'join' && data === BOT && (
        <EntryItem tip="Bot" below={isFirst}>
          <BotIcon className="w-5" />
        </EntryItem>
      )}

      {/* Additional Data */}
      {action === 'rename' && data && <EntryItem>&quot;{data || ''}&quot;</EntryItem>}

      {action === 'pause' && data && <EntryItem><i className="text-sm mr-2">(after {data}s)</i></EntryItem>}

      {(action === 'rename' || action === 'join') && byHost && <EntrySpace />}

      {/* By Host tag */}
      {byHost && <EntryItem color={-1} inv={true}>by host</EntryItem>}

      {/* Create game data */}
      {action === 'settings' && gameData?.id && (
        <EntryItem gameData={gameData} below={isFirst}><GearIcon className="w-5 fill-current ml-2" /></EntryItem>
      )}
    </EntryWrapper>
  )
}


const LogEntry = ({ isLoading, ...props }: Props) => (
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
  index: number,
  entry: LogEntryFull,
  players: BasicPlayer[],
  isFirst?: boolean,
  isPrivate?: boolean,
  setCard: (card?: GameCardPartial) => void,
  childProps?: IntersectionChildProps,
}

type Props = Omit<FullProps, 'entry'> & {
  index: number,
  isLoading: boolean,
  entry?: FullProps['entry'],
}