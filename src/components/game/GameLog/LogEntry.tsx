import type { BasicPlayer, Game, GameCardPartial, LogEntryFull } from "types/game"
import CookieIcon from "components/svgs/CookieIcon"
import BotIcon from "components/svgs/BotIcon"
import GearIcon from "components/svgs/GearIcon"
import WatcherIcon from "components/svgs/WatcherIcon"
import { EntryWrapper, EntryItem, EntrySpace, MissingCard, EntryLoading } from "./LogStyles"
import { IntersectionChildProps } from "components/base/libs/hooks"
import { getName } from "./log.utils"
import { formatLogAction, logFullDate, logTimestamp } from "assets/strings"
import { ALL_WATCHERS, BOT } from "assets/constants"
import { allActions } from "types/logs"


function FullLogEntry({ entry, players, isFirst, isPrivate = false, setCard, childProps }: FullProps) {
  const { time, action, data, hostId, sessionId, playerId, card, gameId } = entry
  
  const playerIdx = playerId ? players.findIndex(({ id }) => id === playerId) : -2
  const actionIdx = allActions.indexOf(action)
  
  const name = getName(entry)
  const isGame = ['settings','round'].includes(action)
  const isWatcher = action === 'view' ? !hostId : !isGame && !playerId && (!!sessionId || data === ALL_WATCHERS)

  const gameData: Partial<Game> | undefined = action === 'settings' ? data && JSON.parse(data) : undefined

  return(
    <EntryWrapper childProps={childProps}>
      {/* Date */}
      <EntryItem tip={logFullDate(time)} below={isFirst} right={true}>{logTimestamp(time)}</EntryItem>
      <EntrySpace />

      {/* Watcher */}
      {isWatcher && <>
        <EntryItem tip="Watcher" below={isFirst}>
          <WatcherIcon className="w-5 fill-current" />
        </EntryItem>
        <EntrySpace />
      </>}

      {/* Player or Game */}
      {<>
        <EntryItem tip={isGame ? gameId : playerId} below={isFirst} right={true} color={playerIdx} inv={true}>{
          name ? name : // Session name
          playerIdx !== -2 ? players[playerIdx]?.name || playerId : // Player name
          sessionId ? 'Watcher' : 'Game' // Generic entry
        }</EntryItem>
        <EntrySpace />
      </>}

      {/* Session ID */}
      {sessionId === BOT ? <>
        <EntryItem tip="Bot" below={isFirst}>
          <BotIcon className="w-5" />
        </EntryItem>
        <EntrySpace />
      </>:
      sessionId && action !== 'view' && <>
        <EntryItem tip={sessionId} below={isFirst}>
          <CookieIcon className="w-5 fill-current" />
        </EntryItem>
        <EntrySpace />
      </>}

      {/* Main Action */}
      <EntryItem tip={!isPrivate && card ? `${card.cardId} ${card.id}` : undefined} color={actionIdx} below={isFirst}>
        {formatLogAction(action, data, hostId, gameData)}
      </EntryItem>
      <EntrySpace />
      
      {/* Card */}
      {!isPrivate && card && <EntryItem onClick={() => setCard(card)}>{card.card.name}</EntryItem>}
      {action === 'pick' && !card && <EntryItem><MissingCard /></EntryItem>}

      {/* Additional Data */}
      {action === 'rename' && data && <>
        <EntryItem>&quot;{data || ''}&quot;</EntryItem>
        <EntrySpace />
      </>}

      {action === 'pause' && data && <>
        <EntryItem><i className="text-sm mr-2">(after {data}s)</i></EntryItem>
        <EntrySpace />
      </>}

      {/* By Host tag */}
      {hostId && <EntryItem color={-1} inv={true} tip={hostId} below={isFirst}>by host</EntryItem>}

      {/* By Watcher tag */}
      {action === 'view' && !hostId && <EntryItem color={-1} inv={true} tip={sessionId} below={isFirst}>by watcher</EntryItem>}

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
  entry?: FullProps['entry'],
  isLoading: boolean,
}