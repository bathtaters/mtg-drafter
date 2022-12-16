import type { Game, GameStatus } from "@prisma/client"
import type { BoardLands } from "types/game"
import type { ToastAlert } from "components/base/common/Alerts/alerts.d"
import Link from "next/link"
import { formatBytes, getObjectSum } from "components/base/services/common.services"

export const FullGame = () => <p className="opacity-70 italic">
  Wait here for an opening or <Link href="/"><a className="link link-primary link-hover">start a new one</a></Link>.
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