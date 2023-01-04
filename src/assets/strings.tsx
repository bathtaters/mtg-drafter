import type { Game, GameStatus, LogAction } from "@prisma/client"
import type { BoardLands, LogOptions } from "types/game"
import type { ToastAlert } from "components/base/common/Alerts/alerts.d"
import Link from "next/link"
import { formatBytes, getObjectSum } from "components/base/services/common.services"
import { ReactNode } from "react"
import CardIcon from "components/svgs/CardIcon"
import HostIcon from "components/svgs/HostIcon"

export const FullGame = () => <p className="opacity-70 italic">
  Wait here for an opening or <Link href="/" className="link link-primary link-hover">start a new one</Link>.
</p>

export const roundCounter = (status?: GameStatus, game?: Game) =>
  !status ? 'Waiting Room' :
  status === 'start' ? 'Starting Soon' :
  status === 'end' ? 'Finished' :
    `Pack ${game?.round ?? '–'} of ${game?.roundCount ?? '–'}`

export const hostButtonLabel: { [label in GameStatus]: string } = {
  start:  'Start Game',
  active: 'Next Round',
  last:   'End Game',
  end:    'End Game',
}

export const cardCounter = (count?: number, lands?: BoardLands) => typeof count !== 'number' || (!count && !lands) ? undefined :
  lands ? `${count} | ${getObjectSum(lands) + count}` : `${count}`

export const sharingMessage: { [key: string]: ToastAlert} = {
  copy: { message: 'Link copied to clipboard', theme: 'info' },
  error: { message: 'Unable to share link, refresh page then try again', theme: 'error' },
  unavailable: { message: 'Link sharing is not available in your browser', theme: 'error' },
}

export const maxSizeError = (size: number, maxSize: number) => `File exceeds ${formatBytes(maxSize)} limit (${formatBytes(size)})`

export const logOptionLabels: Record<keyof LogOptions, ReactNode> = {
  hideHost: <span>Show Host<HostIcon className="ml-2 w-5 ms-2x" /></span>,
  hidePrivate: <span>Show Secrets<CardIcon className="ml-2 w-5 stroke-current fill-primary-content inline" /></span>,
}

export const logFullDate = (dt: Date) => dt.toLocaleString(undefined, { timeStyle: 'medium', dateStyle: 'medium'})

export const logTimestamp = (dt: Date) => dt.toLocaleTimeString(undefined, { timeStyle: 'short' }).replace(' ','').padStart(7, '0').slice(0,6).toLowerCase()

export const formatLogAction = (action: LogAction, data: string | null, byHost: boolean) => {
  // Log output: Player|Game <formatLogAction()> <data|card|none> <byHost>

  switch(action) {
    case 'pick':
      if (!data) return 'picked'

      const [ pack, pick = '' ] = data?.split(':', 2)
      return ` pack-${pack.padStart(2,'0')} pick-${pick.padStart(2,'0')}`

    case 'join': return byHost ? 'added' : 'joined'
    case 'leave': return byHost ? 'removed' : 'left'

    case 'rename': return byHost ? 'renamed' : 'renamed'

    case 'settings':
      if (!data) return 'settings updated'

      return ` ${Object.entries(JSON.parse(data)).map(([ key, val ]) => 
        `${key} changed to "${val}"`
      ).join(', ') || 'settings saved (Nothing changed)'} `
    
    case 'round': return `Round ${data || '?'}`
    default: return `${action}ed`
  }
}