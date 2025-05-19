import type { Layout } from "types/scryfall"
import type { Game, PartialGame, BoardLands, GameStatus, LogAction, LogData, LogOptions, PickInfo } from "types/game"
import type { ViewAuthError } from "types/logs"
import type { ToastAlert } from "components/base/common/Alerts/alerts.d"
import Link from "next/link"
import { formatBytes, getObjectSum } from "components/base/services/common.services"
import { ReactNode } from "react"
import CardIcon from "components/svgs/CardIcon"
import HostIcon from "components/svgs/HostIcon"
import UserIcon from "components/svgs/UserIcon"
import WatcherIcon from "components/svgs/WatcherIcon"
import { ALL_WATCHERS } from "./constants"

export const uploadHelp = "Expects a .txt of card names. \nOne per line with no formatting."

export const banMsg = "Access restricted"
export const noPwMsg = "Password missing"
export const viewedMsg = "Cannot join after viewing cards"

export const viewAuthError: Record<ViewAuthError, string> = {
  'NOAUTH': 'User is not an active watcher or host.',
  'PLAYER': 'User has previously joined this game as player.',
  'DEFAULT': 'Unable to authorize.',
  'UI': 'Required selections were not made.',
  'MISSING': 'Error connecting to game. Please refresh page and try again.',
}

export const FullGame = () => <p className="opacity-70 italic">
  Wait here for an opening or <Link href="/" className="link link-primary link-hover">start a new one</Link>.
</p>

export const NoGames = () => <p className="opacity-70 italic text-center">
  <span>Unable to find any current games. </span>
  <Link href="/" className="link link-primary link-hover">Click here start a new one</Link>.
</p>

export const roundCounter = (status?: GameStatus, game?: Game|PartialGame, isNotJoined = false) =>
  isNotJoined || !status || !game || !('round' in game) ? 'Waiting Room' :
  status === 'start' ? 'Starting Soon' :
  status === 'end' ? 'Finished' :
    `Pack ${game?.round ?? '–'} of ${game?.roundCount ?? '–'}`

export const hostButtonLabel: { [label in GameStatus]?: string } & { packShow?: string, packHide?: string } = {
  start:  'Start Game',
  active: 'Next Round',
  last:   'End Game',
  packShow: "View Cards >",
  packHide: "< Back",
}

export const hostPlayerTooltips: { [label in `set${'Host'|'Bot'}`]: string } = {
    setHost: 'Make Host',
    setBot: 'Add Bot',
}

export const cardCounter = (count?: number, lands?: BoardLands) => typeof count !== 'number' || (!count && !lands) ? undefined :
  lands ? `${count} | ${getObjectSum(lands) + count}` : `${count}`

export const pickInfoText = ({ name, pick, pack }: PickInfo[string], isDeck: boolean) => {
  const packPick = !isDeck ?
    (pick ? `P${pick}` : undefined) :
    pick || pack ? `P${pack || '?'}/P${pick || '?'}` : undefined
  return isDeck ? packPick :
    name && packPick ? <><span>{name}</span><i className="ml-1">{` [${packPick}]`}</i></> :
    name ? name : packPick
}

export const sharingMessage: Record<string,ToastAlert> = {
  copy: { message: 'Link copied to clipboard', theme: 'info' },
  error: { message: 'Unable to share link, refresh page then try again', theme: 'error' },
  unavailable: { message: 'Link sharing is not available in your browser', theme: 'error' },
}

export const maxSizeError = (size: number, maxSize: number) => `File exceeds ${formatBytes(maxSize)} limit (${formatBytes(size)})`

export const timerAlertMsg = (sec: number) => `Under ${sec} seconds left to pick!`,
  timerAlertOpts: NotificationOptions = { requireInteraction: true }

// See constants: timerOptions for settings
export const timerText: Record<"value"|"tooltip", string>[] = [
  { value: 'Off', tooltip: 'Off: No timer' },
  { value: '24hr', tooltip: '24hr timer: 24 hrs per pick' },
  { value: 'Zen', tooltip: 'Zen timer: 10:00 (15) -> 2:00 (1 card)' },
  { value: 'Chill', tooltip: 'Chill timer: 7:30 (15) -> 1:00 (1 card)' },
  { value: 'Relaxed', tooltip: 'Relaxed timer: 5:00 (15) -> 0:30 (1 card)' },
  { value: 'Casual', tooltip: 'Casual timer: 2:30 (15) -> 0:15 (1 card)' },
  { value: 'Slower', tooltip: 'Slower timer: 1:30 (15) -> 0:10 (1 card)' },
  { value: 'Official', tooltip: 'Official timer: 0:40 (15) -> 0:05 (1 card)' },
  { value: 'Faster', tooltip: 'Faster timer: 0:30 (15) -> 0:05 (1 card)' },
  { value: 'Speed', tooltip: 'Speed timer: 0:20 (15) -> 0:03 (1 card)' },
]

// Text to display on rendered card, key is card layout (auto displays <Layout> if card has multiple faces)
export const cardLayoutText: {[layout in Layout]?: string} = {
  modal_dfc: 'Modal',
}

export const logOptionLabels: Record<keyof LogOptions | "showSidebar", ReactNode> = {
  hideHost: <span>Show Host<HostIcon className="ml-2 w-5 ms-2x" /></span>,
  hidePrivate: <span>Show Secrets<CardIcon className="ml-2 w-5 stroke-current fill-primary-content inline" /></span>,
  hideWatchers: <span>Show Watchers<WatcherIcon className="ml-2 w-5 fill-current inline" /></span>,
  showSidebar: <span>Show Players<UserIcon className="ml-2 w-5 fill-current inline" /></span>,
}

export const logFullDate = (dt: Date) => dt.toLocaleString(undefined, { timeStyle: 'medium', dateStyle: 'medium'})

export const logTimestamp = (dt: Date) => dt.toLocaleTimeString(undefined, { timeStyle: 'short' }).replace(' ','').padStart(7, '0').slice(0,6).toLowerCase()

export const logFilename = (gameUrl: string) => `drafter_log_${gameUrl}_${new Date().toLocaleDateString('en-CA').replaceAll('-','')}`
export const LOG_EXT = '.json'

export const formatLogAction = (action: LogAction, data: LogData, hostId: Game['hostId'], gameData?: Partial<Game>) => {
  // Log output: Player|Game <formatLogAction()> <data|card|none> <byHost>

  switch(action) {
    case 'pick':
      if (!data) return 'picked'

      const [ pack, pick = '' ] = data.split(':', 2)
      return ` pack-${pack.padStart(2,'0')} pick-${pick.padStart(2,'0')}`

    case 'view':
      if (!data) return 'viewed'
      return isNaN(+data) ? `${data}board viewed` : `pack-${data.padStart(2,'0')} viewed`

    case 'join': return hostId ? 'added' : 'joined'
    case 'leave': return !hostId ? 'left' :
      data === ALL_WATCHERS ? 'cleared' : 'removed' 

    case 'rename': return hostId ? 'renamed' : 'renamed'

    case 'settings':
      if (!gameData) return 'settings updated'

      if (gameData.id) return 'created'
      return ` ${Object.entries(gameData).map(([ key, val ]) => 
        key === 'timerBase' ? `timer ${!val ? 'disabled' : `set to "${timerText[+val]?.value || val}"`}` :
        key === 'hostId' ? 'became host' :
        /* Default: */ `${key} changed to "${val}"`
      ).join(', ') || 'settings saved (Nothing changed)'} `
    
    case 'round': return data === 'END' ? 'Ended' : `Round ${data || '?'}`

    case 'pause': return data ? 'Resumed' : 'Paused'

    case 'ban':
    case 'unban':
      return `${action}ned`
      
    default: return `${action}ed`
  }
}